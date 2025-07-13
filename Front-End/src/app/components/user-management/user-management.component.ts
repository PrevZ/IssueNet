import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { User, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = false;
  currentUser: User | null = null;

  // Form per filtri
  filterForm!: FormGroup;

  // Configurazione tabella
  displayedColumns: string[] = ['full_name', 'username', 'email', 'role', 'actions'];

  // Opzioni ruoli
  roleOptions = [
    { value: 'admin', label: 'Admin', color: 'warn', icon: 'admin_panel_settings' },
    { value: 'developer', label: 'Developer', color: 'primary', icon: 'code' },
    { value: 'tester', label: 'Tester', color: 'accent', icon: 'bug_report' }
  ];

  // Statistiche utenti
  userStats = {
    total: 0,
    admin: 0,
    developer: 0,
    tester: 0
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.initFilterForm();
  }

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    this.loadUsers();
  }

  private initFilterForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      role: ['']
    });

    // Reagisci ai cambiamenti nei filtri
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
        this.calculateStats();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento degli utenti:', error);
        this.showSnackBar('Errore nel caricamento degli utenti', 'error');
        this.isLoading = false;
      }
    });
  }

  private calculateStats(): void {
    this.userStats = {
      total: this.users.length,
      admin: this.users.filter(u => u.role === 'admin').length,
      developer: this.users.filter(u => u.role === 'developer').length,
      tester: this.users.filter(u => u.role === 'tester').length
    };
  }

  applyFilters(): void {
    const searchTerm = this.filterForm.get('search')?.value?.toLowerCase() || '';
    const selectedRole = this.filterForm.get('role')?.value;

    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !searchTerm || 
        user.full_name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);

      const matchesRole = !selectedRole || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }

  openEditUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: {
        user: user,
        mode: user ? 'edit' : 'create',
        currentUser: this.currentUser
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === 'create') {
          this.handleCreateUser(result.data);
        } else if (result.type === 'update') {
          this.handleUpdateUser(user!.id_user, result.data);
        }
      }
    });
  }

  private handleCreateUser(userData: CreateUserRequest): void {
    this.userService.createUser(userData).subscribe({
      next: (newUser) => {
        this.users.push(newUser);
        this.applyFilters();
        this.calculateStats();
        this.showSnackBar('Utente creato con successo', 'success');
      },
      error: (error) => {
        console.error('Errore nella creazione dell\'utente:', error);
        this.showSnackBar('Errore nella creazione dell\'utente', 'error');
      }
    });
  }

  private handleUpdateUser(userId: number, userData: UpdateUserRequest): void {
    this.userService.updateUser(userId, userData).subscribe({
      next: () => {
        // Aggiorna l'utente nell'array locale
        const index = this.users.findIndex(u => u.id_user === userId);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...userData };
          this.applyFilters();
          this.calculateStats();
        }
        this.showSnackBar('Utente aggiornato con successo', 'success');
      },
      error: (error) => {
        console.error('Errore nell\'aggiornamento dell\'utente:', error);
        this.showSnackBar('Errore nell\'aggiornamento dell\'utente', 'error');
      }
    });
  }

  deleteUser(user: User): void {
    if (user.id_user === this.currentUser?.id_user) {
      this.showSnackBar('Non puoi eliminare il tuo account', 'warn');
      return;
    }

    if (confirm(`Sei sicuro di voler eliminare l'utente ${user.full_name}?`)) {
      this.userService.deleteUser(user.id_user).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id_user !== user.id_user);
          this.applyFilters();
          this.calculateStats();
          this.showSnackBar('Utente eliminato con successo', 'success');
        },
        error: (error) => {
          console.error('Errore nell\'eliminazione dell\'utente:', error);
          this.showSnackBar('Errore nell\'eliminazione dell\'utente', 'error');
        }
      });
    }
  }

  getRoleInfo(role: string) {
    return this.roleOptions.find(r => r.value === role) || this.roleOptions[1];
  }

  canEditUser(user: User): boolean {
    // Gli admin possono modificare tutti
    // Gli utenti possono modificare solo se stessi
    return this.currentUser?.role === 'admin' || this.currentUser?.id_user === user.id_user;
  }

  canDeleteUser(user: User): boolean {
    // Solo gli admin possono eliminare utenti, ma non se stessi
    return this.currentUser?.role === 'admin' && this.currentUser?.id_user !== user.id_user;
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'warn'): void {
    const config = {
      duration: 3000,
      panelClass: [`${type}-snack`]
    };

    this.snackBar.open(message, 'Chiudi', config);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filteredUsers = [...this.users];
  }

  exportUsers(): void {
    // Implementazione futura per esportare la lista utenti
    this.showSnackBar('Funzionalità di esportazione in arrivo', 'success');
  }
}
