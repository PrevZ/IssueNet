import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Issue } from '../../models/issue.model';
import { User } from '../../models/user.model';
import { IssueService } from '../../services/issue.service';
import { UserService } from '../../services/user.service';
import { CommentSectionComponent } from '../comment-section/comment-section.component';

@Component({
  selector: 'app-issue-board',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatDividerModule,
    MatTabsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    CommentSectionComponent
  ],
  templateUrl: './issue-board.html',
  styleUrl: './issue-board.css'
})
export class IssueBoard implements OnInit {
  issue: Issue | null = null;
  projectUsers: User[] = [];
  isLoading = true;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const issueId = +params['id'];
      if (issueId) {
        this.loadIssue(issueId);
      }
    });
  }

  loadIssue(issueId: number): void {
    this.isLoading = true;
    
    this.issueService.getIssueById(issueId).subscribe({
      next: (issue) => {
        this.issue = issue;
        this.loadProjectUsers();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading issue:', error);
        this.isLoading = false;
      }
    });
  }

  loadProjectUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.projectUsers = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.projectUsers = [];
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getPriorityColor(): string {
    if (!this.issue) return 'primary';
    switch (this.issue.priority) {
      case 'low': return 'primary';
      case 'medium': return 'accent';
      case 'high': return 'warn';
      case 'critical': return 'warn';
      default: return 'primary';
    }
  }

  getStatusColor(): string {
    if (!this.issue) return 'primary';
    switch (this.issue.status) {
      case 'todo': return 'primary';
      case 'in_progress': return 'accent';
      case 'in_review': return 'warn';
      case 'done': return 'primary';
      default: return 'primary';
    }
  }

  getTypeIcon(): string {
    if (!this.issue) return 'help';
    switch (this.issue.type) {
      case 'bug': return 'bug_report';
      case 'feature': return 'star';
      case 'task': return 'task';
      case 'improvement': return 'trending_up';
      default: return 'help';
    }
  }

  getStatusLabel(): string {
    if (!this.issue) return '';
    const statusMap = {
      'todo': 'Da Fare',
      'in_progress': 'In Corso',
      'in_review': 'In Revisione',
      'done': 'Completato'
    };
    return statusMap[this.issue.status] || this.issue.status;
  }

  getPriorityLabel(): string {
    if (!this.issue) return '';
    const priorityMap = {
      'low': 'Bassa',
      'medium': 'Media',
      'high': 'Alta',
      'critical': 'Critica'
    };
    return priorityMap[this.issue.priority] || this.issue.priority;
  }

  getTypeLabel(): string {
    if (!this.issue) return '';
    const typeMap = {
      'bug': 'Bug',
      'feature': 'Feature',
      'task': 'Task',
      'improvement': 'Miglioramento'
    };
    return typeMap[this.issue.type] || this.issue.type;
  }

  getAssignedUser(): User | undefined {
    if (!this.issue) return undefined;
    return this.projectUsers.find(user => user.id_user === this.issue!.assigned_to);
  }

  getCreatedUser(): User | undefined {
    if (!this.issue) return undefined;
    return this.projectUsers.find(user => user.id_user === this.issue!.created_by);
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
    if (!this.issue || !this.issue.due_date) return false;
    return new Date(this.issue.due_date) < new Date() && this.issue.status !== 'done';
  }
}
