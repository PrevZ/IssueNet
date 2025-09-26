import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
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
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword implements OnInit {
  currentUser: User | null = null;
  passwordForm: FormGroup;
  isLoading = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  // Costruttore del componente
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Inizializza form con validatori
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator }); // Validatore a livello form per conferma password
  }

  // Inizializza il componente e sottoscrive ai dati utente corrente
  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Validatore personalizzato per verificare corrispondenza nuova password
  passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  // Genera le iniziali dell'utente per avatar
  getInitials(): string {
    if (!this.currentUser?.full_name) return '';
    return this.currentUser.full_name
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  // Gestisce l'invio del form per il cambio password
  onSubmit(): void {
    if (this.passwordForm.valid && this.currentUser) {
      this.isLoading = true;
      const formData = this.passwordForm.value;

      // Prepara dati per chiamata API
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };

      // Chiama servizio per cambio password
      this.userService.changePassword(this.currentUser.id_user, passwordData).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert('Password cambiata con successo!');
          this.passwordForm.reset();
          this.router.navigate(['/user-profile']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error changing password:', error);

          // Mostra errore specifico all'utente
          if (error.error?.error) {
            alert('Errore: ' + error.error.error);
          } else {
            alert('Errore durante il cambio password. Riprova.');
          }
        }
      });
    }
  }

  // Annulla l'operazione e torna al profilo utente
  onCancel(): void {
    this.router.navigate(['/user-profile']);
  }
}
