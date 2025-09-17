import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css'
})
export class EditUser implements OnInit {
  currentUser: User | null = null;
  editForm: FormGroup;
  isLoading = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.editForm.patchValue({
          full_name: user.full_name,
          email: user.email,
          username: user.username
        });
      }
    });
  }

  getInitials(): string {
    if (!this.currentUser?.full_name) return '';
    return this.currentUser.full_name
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  onSubmit(): void {
    if (this.editForm.valid && this.currentUser) {
      this.isLoading = true;
      const userData = this.editForm.value;
      console.log('Updating user with data:', userData);

      this.userService.updateProfile(this.currentUser.id_user, userData).subscribe({
        next: () => {
          this.isLoading = false;
          // Il UserService aggiorna automaticamente currentUser$ nel tap()
          this.router.navigate(['/user-profile']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating profile:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/user-profile']);
  }
}
