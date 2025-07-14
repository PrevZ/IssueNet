import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatDividerModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfile implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isEditing = false;

  userStats = {
    totalProjects: 0,
    totalIssues: 0,
    comments: 0
  };

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      full_name: [''],
      email: [''],
      // aggiungi altri campi se necessario
    });
  }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          full_name: user.full_name,
          email: user.email
        });
      }
    });
  }

  enableEdit() {
    this.isEditing = true;
    this.profileForm.enable();
  }

  saveProfile() {
    if (this.profileForm.valid && this.currentUser) {
      const userId = this.currentUser.id_user;
      // Prendi solo i campi modificabili
      const userData = {
        full_name: this.profileForm.value.full_name,
        email: this.profileForm.value.email
        // aggiungi altri campi modificabili se necessario
      };
      this.userService.updateProfile(userId, userData).subscribe(() => {
        this.isEditing = false;
        // Aggiorna lo stato globale se necessario
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    if (this.currentUser) {
      this.profileForm.patchValue({
        full_name: this.currentUser.full_name,
        email: this.currentUser.email
      });
    }
    this.profileForm.disable();
  }

  logout() {
    this.userService.logout();
    // Puoi aggiungere un redirect se necessario
  }

  openChangePasswordDialog() {
    // Stub: mostra un alert o apri un dialog
    alert('Funzionalità in sviluppo!');
  }
}
