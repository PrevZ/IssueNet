import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

import { Comment, CreateCommentRequest, UpdateCommentRequest } from '../../models/comment.model';
import { User } from '../../models/user.model';
import { CommentService } from '../../services/comment.service';
import { UserService } from '../../services/user.service';
import { Nl2brPipe } from '../../pipes/nl2br.pipe';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatBadgeModule,
    MatMenuModule,
    MatTooltipModule,
    Nl2brPipe
  ],
  templateUrl: './comment-section.component.html',
  styleUrl: './comment-section.component.css'
})
export class CommentSectionComponent implements OnInit, OnDestroy, OnChanges {
  @Input() issueId!: number;
  @Input() projectUsers: User[] = [];

  comments: Comment[] = [];
  commentForm!: FormGroup;
  editingCommentId: number | null = null;
  editForm!: FormGroup;
  isSubmitting = false;
  currentUser: User | null = null;

  private subscriptions = new Subscription();

  // Opzioni per ordinamento
  sortOptions = [
    { value: 'newest', label: 'Più recenti' },
    { value: 'oldest', label: 'Più vecchi' }
  ];
  currentSort = 'newest';

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private userService: UserService
  ) {
    this.initForms();
    this.currentUser = this.userService.getCurrentUser();
  }

  ngOnInit(): void {
    if (this.issueId) {
      this.loadComments();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reagisce ai cambiamenti di projectUsers
    if (changes['projectUsers'] && changes['projectUsers'].currentValue) {
      this.populateUserData();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForms(): void {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]]
    });

    this.editForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]]
    });
  }

  loadComments(): void {
    const sub = this.commentService.getCommentsByIssue(this.issueId).subscribe({
      next: (comments) => {
        // Valida e correggi le date per ogni commento
        this.comments = comments.map(comment => {
          if (!comment.created_at || isNaN(new Date(comment.created_at).getTime())) {
            comment.created_at = new Date().toISOString();
          }
          if (!comment.updated_at || isNaN(new Date(comment.updated_at).getTime())) {
            comment.updated_at = comment.created_at;
          }
          return comment;
        });
        this.sortComments();
        this.populateUserData();
      },
      error: (error) => {
        console.error('Errore nel caricamento dei commenti:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  private populateUserData(): void {
    // Se non abbiamo projectUsers, proviamo a caricarli
    if (!this.projectUsers || this.projectUsers.length === 0) {
      this.loadAllUsers();
      return;
    }
    
    // Popola i dati utente per ogni commento
    this.comments.forEach(comment => {
      if (!comment.user) {
        comment.user = this.projectUsers.find(user => user.id_user === comment.id_user);
      }
    });
  }

  private loadAllUsers(): void {
    const sub = this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.projectUsers = users;
        this.comments.forEach(comment => {
          comment.user = this.projectUsers.find(user => user.id_user === comment.id_user);
        });
      },
      error: (error) => {
        console.error('Errore nel caricamento degli utenti:', error);
      }
    });
    this.subscriptions.add(sub);
  }

  private sortComments(): void {
    this.comments.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      
      return this.currentSort === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }

  onSortChange(sortType: string): void {
    this.currentSort = sortType;
    this.sortComments();
  }

  onSubmitComment(): void {
    if (this.commentForm.valid && this.currentUser) {
      this.isSubmitting = true;
      
      const commentData: CreateCommentRequest = {
        id_issue: this.issueId,
        id_user: this.currentUser.id_user,
        content: this.commentForm.get('content')?.value.trim()
      };

      const sub = this.commentService.createComment(commentData).subscribe({
        next: (newComment) => {
          // Assicurati che la data sia in formato valido
          if (!newComment.created_at || isNaN(new Date(newComment.created_at).getTime())) {
            newComment.created_at = new Date().toISOString();
          }
          if (!newComment.updated_at || isNaN(new Date(newComment.updated_at).getTime())) {
            newComment.updated_at = newComment.created_at;
          }
          
          this.comments.unshift(newComment);
          this.commentForm.reset();
          this.isSubmitting = false;
          this.populateUserData();
        },
        error: (error) => {
          console.error('Errore nella creazione del commento:', error);
          this.isSubmitting = false;
        }
      });
      this.subscriptions.add(sub);
    }
  }

  startEdit(comment: Comment): void {
    this.editingCommentId = comment.id_comment;
    this.editForm.patchValue({
      content: comment.content
    });
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editForm.reset();
  }

  onSubmitEdit(commentId: number): void {
    console.log('onSubmitEdit called with commentId:', commentId);
    console.log('Form valid:', this.editForm.valid);
    console.log('Form value:', this.editForm.value);
    console.log('isSubmitting:', this.isSubmitting);
    
    if (this.editForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const updateData: UpdateCommentRequest = {
        content: this.editForm.get('content')?.value.trim()
      };

      console.log('Sending update request with data:', updateData);

      const sub = this.commentService.updateComment(commentId, updateData).subscribe({
        next: (response) => {
          console.log('Update successful, response:', response);
          // Aggiorna il commento nell'array locale
          const index = this.comments.findIndex(c => c.id_comment === commentId);
          if (index !== -1) {
            this.comments[index].content = updateData.content;
            this.comments[index].updated_at = new Date().toISOString();
          }
          
          this.cancelEdit();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Errore nell\'aggiornamento del commento:', error);
          this.isSubmitting = false;
        }
      });
      this.subscriptions.add(sub);
    } else {
      console.log('Form validation failed or already submitting');
      if (this.editForm.errors) {
        console.log('Form errors:', this.editForm.errors);
      }
    }
  }

  deleteComment(commentId: number): void {
    console.log('deleteComment called with commentId:', commentId);
    if (confirm('Sei sicuro di voler eliminare questo commento?')) {
      console.log('User confirmed deletion');
      const sub = this.commentService.deleteComment(commentId).subscribe({
        next: (response) => {
          console.log('Comment deleted successfully, response:', response);
          this.comments = this.comments.filter(c => c.id_comment !== commentId);
        },
        error: (error) => {
          console.error('Errore nell\'eliminazione del commento:', error);
          console.log('Error status:', error.status);
          console.log('Error message:', error.message);
          
          // Se l'errore è 404 (Not Found) o 200-299, considera l'operazione riuscita
          if (error.status === 404 || (error.status >= 200 && error.status < 300)) {
            console.log('Treating as successful deletion despite error response');
            this.comments = this.comments.filter(c => c.id_comment !== commentId);
          } else {
            alert('Errore durante l\'eliminazione del commento. Riprova.');
          }
        },
        complete: () => {
          console.log('Delete operation completed');
        }
      });
      this.subscriptions.add(sub);
    } else {
      console.log('User cancelled deletion');
    }
  }

  canEditComment(comment: Comment): boolean {
    return this.currentUser?.id_user === comment.id_user || this.currentUser?.role === 'admin';
  }

  canDeleteComment(comment: Comment): boolean {
    return this.currentUser?.id_user === comment.id_user || this.currentUser?.role === 'admin';
  }

  getTimeAgo(date: string): string {
    const now = new Date();
    const commentDate = new Date(date);
    
    // Verifica se la data è valida
    if (isNaN(commentDate.getTime())) {
      return 'Data non valida';
    }
    
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Ora';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min fa`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ore fa`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} giorni fa`;
    } else {
      return commentDate.toLocaleDateString('it-IT');
    }
  }

  getUserDisplayName(comment: Comment): string {
    if (!comment.user) {
      console.log(`User data missing for comment ${comment.id_comment}, user ID: ${comment.id_user}`);
      console.log('Available projectUsers:', this.projectUsers);
    }
    return comment.user?.full_name || 'Utente sconosciuto';
  }

  getUserRole(comment: Comment): string {
    const roleMap = {
      'admin': 'Admin',
      'developer': 'Developer',
      'tester': 'Tester'
    };
    return comment.user?.role ? roleMap[comment.user.role] || comment.user.role : '';
  }

  trackByCommentId(index: number, comment: Comment): number {
    return comment.id_comment;
  }
}
