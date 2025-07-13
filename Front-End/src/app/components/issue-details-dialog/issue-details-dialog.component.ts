import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';

import { Issue } from '../../models/issue.model';
import { User } from '../../models/user.model';
import { CommentSectionComponent } from '../comment-section/comment-section.component';

export interface IssueDetailsDialogData {
  issue: Issue;
  projectUsers: User[];
}

@Component({
  selector: 'app-issue-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatBadgeModule,
    CommentSectionComponent
  ],
  templateUrl: './issue-details-dialog.component.html',
  styleUrl: './issue-details-dialog.component.css'
})
export class IssueDetailsDialogComponent implements OnInit {
  
  constructor(
    public dialogRef: MatDialogRef<IssueDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IssueDetailsDialogData
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }

  getPriorityColor(): string {
    switch (this.data.issue.priority) {
      case 'low': return 'primary';
      case 'medium': return 'accent';
      case 'high': return 'warn';
      case 'critical': return 'warn';
      default: return 'primary';
    }
  }

  getStatusColor(): string {
    switch (this.data.issue.status) {
      case 'todo': return 'primary';
      case 'in_progress': return 'accent';
      case 'in_review': return 'warn';
      case 'done': return 'primary';
      default: return 'primary';
    }
  }

  getTypeIcon(): string {
    switch (this.data.issue.type) {
      case 'bug': return 'bug_report';
      case 'feature': return 'star';
      case 'task': return 'task';
      case 'improvement': return 'trending_up';
      default: return 'help';
    }
  }

  getStatusLabel(): string {
    const statusMap = {
      'todo': 'Da Fare',
      'in_progress': 'In Corso',
      'in_review': 'In Revisione',
      'done': 'Completato'
    };
    return statusMap[this.data.issue.status] || this.data.issue.status;
  }

  getPriorityLabel(): string {
    const priorityMap = {
      'low': 'Bassa',
      'medium': 'Media',
      'high': 'Alta',
      'critical': 'Critica'
    };
    return priorityMap[this.data.issue.priority] || this.data.issue.priority;
  }

  getTypeLabel(): string {
    const typeMap = {
      'bug': 'Bug',
      'feature': 'Feature',
      'task': 'Task',
      'improvement': 'Miglioramento'
    };
    return typeMap[this.data.issue.type] || this.data.issue.type;
  }

  getAssignedUser(): User | undefined {
    return this.data.projectUsers.find(user => user.id_user === this.data.issue.assigned_to);
  }

  getCreatedUser(): User | undefined {
    return this.data.projectUsers.find(user => user.id_user === this.data.issue.created_by);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isOverdue(): boolean {
    if (!this.data.issue.due_date) return false;
    return new Date(this.data.issue.due_date) < new Date() && this.data.issue.status !== 'done';
  }
}
