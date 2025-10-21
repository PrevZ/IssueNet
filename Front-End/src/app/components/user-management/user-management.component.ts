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
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';

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

  filterForm!: FormGroup;
  displayedColumns: string[] = ['full_name', 'username', 'email', 'role', 'actions'];

  // Configurazione delle opzioni dei ruoli per la UI
  roleOptions = [
    { value: 'admin', label: 'Admin', color: 'warn', icon: 'admin_panel_settings' },
    { value: 'project_manager', label: 'Project Manager', color: 'warn', icon: 'engineering' },
    { value: 'developer', label: 'Developer', color: 'primary', icon: 'code' },
    { value: 'tester', label: 'Tester', color: 'accent', icon: 'bug_report' }
  ];

  userStats = {     
    admin: 0, 
    project_manager: 0,     
    developer: 0,  
    tester: 0      
  };

  // Costruttore - inietta le dipendenze necessarie
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // Inizializza il form dei filtri nel costruttore
    this.initFilterForm();
  }

  // Carica l'utente corrente e la lista degli utenti
  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
    // Carica tutti gli utenti dal server
    this.loadUsers();
  }

  // Inizializza il form reattivo per i filtri di ricerca
  private initFilterForm(): void {
    this.filterForm = this.fb.group({
      search: [''],  
      role: ['']     
    });

    // Sottoscrive ai cambiamenti dei valori del form per applicare i filtri automaticamente
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  // Carica la lista completa degli utenti dal server
  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Memorizza gli utenti e inizializza la lista filtrata
        this.users = users;
        this.filteredUsers = [...users];
        // Calcola le statistiche per ruolo
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

  // Calcola le statistiche degli utenti raggruppati per ruolo
  private calculateStats(): void {
    this.userStats = {
      admin: this.users.filter(u => u.role === 'admin').length,
      project_manager: this.users.filter(u => u.role === 'project_manager').length,
      developer: this.users.filter(u => u.role === 'developer').length,
      tester: this.users.filter(u => u.role === 'tester').length
    };
  }

  // Applica i filtri di ricerca e ruolo alla lista degli utenti
  applyFilters(): void {
    const searchTerm = this.filterForm.get('search')?.value?.toLowerCase() || '';
    const selectedRole = this.filterForm.get('role')?.value;

    // Filtra gli utenti in base ai criteri specificati
    this.filteredUsers = this.users.filter(user => {
      // Verifica se l'utente corrisponde al termine di ricerca
      const matchesSearch = !searchTerm || 
        user.full_name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);

      // Verifica se l'utente corrisponde al ruolo selezionato
      const matchesRole = !selectedRole || user.role === selectedRole;

      // L'utente deve soddisfare entrambi i criteri
      return matchesSearch && matchesRole;
    });
  }

  // Apre il dialog per creare un nuovo utente o modificarne uno esistente
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

    // Gestisce il risultato alla chiusura del dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Determina l'azione da eseguire in base al tipo di operazione
        if (result.type === 'create') {
          this.handleCreateUser(result.data);
        } else if (result.type === 'update') {
          this.handleUpdateUser(user!.id_user, result.data);
        }
      }
    });
  }

  // Gestisce la creazione di un nuovo utente
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

  // Gestisce l'aggiornamento di un utente esistente
  private handleUpdateUser(userId: number, userData: UpdateUserRequest): void {
    this.userService.updateUser(userId, userData).subscribe({
      next: () => {
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

  // Gestisce l'eliminazione di un utente con conferma
  deleteUser(user: User): void {
    // Impedisce all'utente di eliminare il proprio account
    if (user.id_user === this.currentUser?.id_user) {
      this.showSnackBar('Non puoi eliminare il tuo account', 'warn');
      return;
    }

    // Apre il dialog di conferma eliminazione
    const dialogRef = this.dialog.open(DeleteUserDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { user },
      disableClose: true  // Forza l'utente a scegliere esplicitamente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
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
    });
  }

  // Verifica se l'utente corrente può modificare l'utente specificato
  canEditUser(user: User): boolean {
    // Gli admin possono modificare tutti, gli utenti solo se stessi
    return this.currentUser?.role === 'admin' || this.currentUser?.id_user === user.id_user;
  }

  // Verifica se l'utente corrente può eliminare l'utente specificato
  canDeleteUser(user: User): boolean {
    // Solo gli admin possono eliminare utenti, ma non se stessi
    return this.currentUser?.role === 'admin' && this.currentUser?.id_user !== user.id_user;
  }

  // Mostra una notifica toast con il messaggio specificato
  private showSnackBar(message: string, type: 'success' | 'error' | 'warn'): void {
    const config = {
      duration: 3000,                    
      panelClass: [`${type}-snack`]      
    };

    this.snackBar.open(message, 'Chiudi', config);
  }

  // Resetta tutti i filtri e mostra tutti gli utenti
  clearFilters(): void {
    this.filterForm.reset();
    this.filteredUsers = [...this.users];
  }
}
