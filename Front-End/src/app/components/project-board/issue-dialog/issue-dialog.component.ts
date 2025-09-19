import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateIssueRequest, UpdateIssueRequest, Issue } from '../../../models/issue.model';
import { User } from '../../../models/user.model';

export interface IssueDialogData {
  projectId: number;
  currentUserId: number;
  projectUsers?: User[];
  issue?: Issue; // Se presente, siamo in modalità modifica
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-issue-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './issue-dialog.component.html',
  styleUrl: './issue-dialog.component.css'
})
export class IssueDialogComponent implements OnInit {
  issueForm!: FormGroup;
  isSubmitting = false;
  isEditMode: boolean;

  priorityOptions = [
    { value: 'low', label: 'Bassa', color: 'primary' },
    { value: 'medium', label: 'Media', color: 'accent' },
    { value: 'high', label: 'Alta', color: 'warn' },
    { value: 'critical', label: 'Critica', color: 'error' }
  ];

  typeOptions = [
    { value: 'bug', label: 'Bug', icon: 'bug_report' },
    { value: 'feature', label: 'Feature', icon: 'star' },
    { value: 'task', label: 'Task', icon: 'assignment' },
    { value: 'improvement', label: 'Miglioramento', icon: 'trending_up' }
  ];

  statusOptions = [
    { value: 'todo', label: 'Da Fare' },
    { value: 'in_progress', label: 'In Corso' },
    { value: 'in_review', label: 'In Revisione' },
    { value: 'done', label: 'Completato' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IssueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IssueDialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.issue) {
      this.populateFormWithIssue(this.data.issue);
    }
  }

  private initializeForm(): void {
    this.issueForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: [this.isEditMode ? '' : 'medium'],
      status: [this.isEditMode ? '' : 'todo'],
      type: [this.isEditMode ? '' : 'task'],
      assigned_to: [''],
      estimated_hours: ['', [Validators.min(0.5), Validators.max(999)]],
      actual_hours: ['', [Validators.min(0), Validators.max(999)]],
      due_date: ['']
    });

    // In modalità creazione, disabilita actual_hours
    if (!this.isEditMode) {
      this.issueForm.get('actual_hours')?.disable();
    }
  }

  private populateFormWithIssue(issue: Issue): void {
    this.issueForm.patchValue({
      title: issue.title,
      description: issue.description || '',
      priority: issue.priority,
      status: issue.status,
      type: issue.type,
      assigned_to: issue.assigned_to || '',
      estimated_hours: issue.estimated_hours || '',
      actual_hours: issue.actual_hours || '',
      due_date: issue.due_date ? new Date(issue.due_date) : ''
    });
  }

  onSubmit(): void {
    if (this.issueForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formValue = this.issueForm.value;
      
      if (this.isEditMode) {
        // Modalità modifica
        const updateData: UpdateIssueRequest = {
          title: formValue.title,
          description: formValue.description || undefined,
          priority: formValue.priority,
          status: formValue.status,
          type: formValue.type,
          assigned_to: formValue.assigned_to || undefined,
          estimated_hours: formValue.estimated_hours || undefined,
          actual_hours: formValue.actual_hours || undefined,
          due_date: formValue.due_date ? formValue.due_date.toISOString().split('T')[0] : undefined
        };
        this.dialogRef.close({ type: 'update', data: updateData });
      } else {
        // Modalità creazione
        const createData: CreateIssueRequest = {
          title: formValue.title,
          description: formValue.description || undefined,
          priority: formValue.priority,
          status: formValue.status,
          type: formValue.type,
          id_project: this.data.projectId,
          assigned_to: formValue.assigned_to || undefined,
          created_by: this.data.currentUserId,
          estimated_hours: formValue.estimated_hours || undefined,
          due_date: formValue.due_date ? formValue.due_date.toISOString().split('T')[0] : undefined
        };
        this.dialogRef.close({ type: 'create', data: createData });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getUserDisplayName(userId: number): string {
    const user = this.data.projectUsers?.find(u => u.id_user === userId);
    return user ? user.full_name : `Utente ${userId}`;
  }
}
