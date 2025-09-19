import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CreateProjectRequest, UpdateProjectRequest, Project } from '../../../models/project.model';

@Component({
  selector: 'app-update-project-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './update-project-dialog.html',
  styleUrl: './update-project-dialog.css'
})
export class UpdateProjectDialogComponent implements OnInit {
  projectForm!: FormGroup;
  isSubmitting = false;
  project: Project | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number; project: Project }
  ) { }

  ngOnInit(): void {
    this.initializeForm(this.data.project);
  }

  private initializeForm(project?: Project): void {
    this.projectForm = this.fb.group({
      name: [project?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [project?.description || ''],
      status: [project?.status || 'active']
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const projectData: UpdateProjectRequest = {
        name: this.projectForm.value.name,
        description: this.projectForm.value.description || '',
        status: this.projectForm.value.status
      };

      this.dialogRef.close(projectData);
    }
  }
}
