import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;

  // Costruttore - inizializza i servizi necessari
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // Inizializzazione del component
  ngOnInit() {
    this.initForm();
    
    // Se l'utente è già loggato, reindirizza alla home
    if (this.userService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  // Inizializza il form di login con validatori
  private initForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Gestisce l'invio del form di login
  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password, rememberMe } = this.loginForm.value;

      const loginRequest = { username, password };

      this.userService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Login effettuato con successo!', 'Chiudi', {
            duration: 3000,
            panelClass: ['success-snack']
          });
          
          // Reindirizza alla home
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.isLoading = false;
          let errorMessage = 'Errore durante il login. Riprova.';
          
          if (error.status === 401) {
            errorMessage = 'username o password non validi.';
          } else if (error.status === 0) {
            errorMessage = 'Impossibile connettersi al server.';
          }
          
          this.snackBar.open(errorMessage, 'Chiudi', {
            duration: 5000,
            panelClass: ['error-snack']
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  // Marca tutti i campi del form come "touched" per mostrare errori
  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Restituisce il messaggio di errore appropriato per un campo
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    
    if (control?.hasError('required')) {
      return `${this.getFieldName(field)} è obbligatorio`;
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldName(field)} deve contenere almeno ${minLength} caratteri`;
    }
    
    return '';
  }

  // Restituisce il nome del campo per gli errori
  private getFieldName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      username: 'Username',
      password: 'Password'
    };
    return fieldNames[field] || field;
  }

  // Alterna la visibilità della password
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
