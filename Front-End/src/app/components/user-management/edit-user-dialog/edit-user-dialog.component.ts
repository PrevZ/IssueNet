import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { User, CreateUserRequest, UpdateUserRequest } from '../../../models/user.model';


export interface EditUserDialogData {
  user?: User;
  mode: 'create' | 'edit';
  currentUser: User | null;
}


@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent implements OnInit {
  userForm!: FormGroup;
  isSubmitting = false;
  isEditMode: boolean;
  hidePassword = true;
  roleOptions = [
    { value: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
    { value: 'developer', label: 'Developer', icon: 'code' },
    { value: 'tester', label: 'Tester', icon: 'bug_report' }
  ];

  // Costruttore del componente
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditUserDialogData
  ) {
    // Determina modalità basata sui dati ricevuti
    this.isEditMode = data.mode === 'edit';
  }

  // Inizializza il componente e il form
  ngOnInit(): void {
    this.initForm();
  }

  // Inizializza il form reattivo con validatori e controlli condizionali
  private initForm(): void {
    this.userForm = this.fb.group({
      full_name: [
        this.data.user?.full_name || '',
        [Validators.required, Validators.minLength(2)]
      ],
      username: [
        this.data.user?.username || '',
        [Validators.required, Validators.minLength(3)]
      ],
      email: [
        this.data.user?.email || '',
        [Validators.required, Validators.email]
      ],
      role: [
        this.data.user?.role || 'developer',
        [Validators.required]
      ]
    });

    // Aggiungi il campo password solo in modalità creazione o se l'admin vuole cambiarla
    if (!this.isEditMode) {
      // Modalità creazione: password obbligatoria
      this.userForm.addControl('password', this.fb.control('', [
        Validators.required,
        Validators.minLength(6)
      ]));
    } else if (this.canChangePassword()) {
      // Modalità modifica: password opzionale con checkbox
      this.userForm.addControl('password', this.fb.control(''));
      this.userForm.addControl('changePassword', this.fb.control(false));
    }

    // Disabilita alcuni campi se non sei admin e stai modificando un altro utente
    if (this.isEditMode && !this.canEditRole()) {
      this.userForm.get('role')?.disable();
    }
  }

  // Gestisce l'invio del form con validazione e preparazione dati
  onSubmit(): void {
    if (this.userForm.valid) {
      this.isSubmitting = true;

      const formValue = this.userForm.value;

      if (this.isEditMode) {
        // Modalità modifica: prepara dati per update
        const updateData: UpdateUserRequest = {
          full_name: formValue.full_name,
          username: formValue.username,
          email: formValue.email
        };

        // Includi il ruolo solo se l'utente può modificarlo
        if (this.canEditRole()) {
          updateData.role = formValue.role;
        }

        // Includi la password solo se è stata specificata e l'utente può cambiarla
        if (this.canChangePassword() && formValue.changePassword && formValue.password) {
          updateData.password = formValue.password;
        }

        // Chiudi dialog con dati di update
        this.dialogRef.close({
          type: 'update',
          data: updateData
        });
      } else {
        // Modalità creazione: prepara dati per nuovo utente
        const createData: CreateUserRequest = {
          full_name: formValue.full_name,
          username: formValue.username,
          email: formValue.email,
          password: formValue.password,
          role: formValue.role
        };

        // Chiudi dialog con dati di creazione
        this.dialogRef.close({
          type: 'create',
          data: createData
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  // Chiude il dialog senza salvare
  onCancel(): void {
    this.dialogRef.close();
  }

  // Inizializza il form reattivo con validatori e controlli condizionali
  private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  // Verifica se l'utente corrente può modificare i ruoli
  canEditRole(): boolean {
    // Solo gli admin possono modificare i ruoli
    return this.data.currentUser?.role === 'admin';
  }

  // Verifica se l'utente corrente può cambiare password
  canChangePassword(): boolean {
    return this.data.currentUser?.role === 'admin' ||
      this.data.currentUser?.id_user === this.data.user?.id_user;
  }

  // Genera il titolo del dialog basato sulla modalità
  getDialogTitle(): string {
    if (this.isEditMode) {
      return `Modifica ${this.data.user?.full_name}`;
    } else {
      return 'Nuovo Utente';
    }
  }

  // Genera il testo del pulsante di invio basato su stato e modalità
  // @returns testo appropriato per il pulsante
  getSubmitButtonText(): string {
    if (this.isSubmitting) {
      return this.isEditMode ? 'Salvando...' : 'Creando...';
    } else {
      return this.isEditMode ? 'Salva Modifiche' : 'Crea Utente';
    }
  }
}
