import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
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
  selector: 'app-register',
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
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initForm();
    
    // Se l'utente è già loggato, reindirizza alla home
    if (this.userService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  private initForm() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9_]+$')]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator per la password
  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
    
    if (!valid) {
      return { 
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasSpecialChar
        }
      };
    }
    return null;
  }

  // Custom validator per verificare che le password corrispondano
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formValue = this.registerForm.value;
      
      // Rimuovi confirmPassword e acceptTerms dal payload
      const { confirmPassword, acceptTerms, ...registerData } = formValue;

      this.userService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Registrazione completata con successo!', 'Chiudi', {
            duration: 3000,
            panelClass: ['success-snack']
          });
          
          // Reindirizza al login dopo la registrazione
          this.router.navigate(['/login'], { 
            queryParams: { message: 'Registrazione completata! Ora puoi accedere.' }
          });
        },
        error: (error) => {
          this.isLoading = false;
          let errorMessage = 'Errore durante la registrazione. Riprova.';
          
          if (error.status === 400) {
            errorMessage = 'Dati non validi. Controlla i campi inseriti.';
          } else if (error.status === 409) {
            errorMessage = 'Username o email già esistenti.';
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

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    
    if (control?.hasError('required')) {
      return `${this.getFieldName(field)} è obbligatorio`;
    }
    
    if (control?.hasError('requiredTrue')) {
      return 'Devi accettare i termini e condizioni';
    }
    
    if (control?.hasError('email')) {
      return 'Inserisci un\'email valida';
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldName(field)} deve contenere almeno ${minLength} caratteri`;
    }
    
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return `${this.getFieldName(field)} non può superare ${maxLength} caratteri`;
    }
    
    if (control?.hasError('pattern') && field === 'username') {
      return 'Username può contenere solo lettere, numeri e underscore';
    }
    
    if (control?.hasError('passwordStrength')) {
      return 'La password deve contenere: maiuscola, minuscola, numero e carattere speciale';
    }
    
    return '';
  }

  private getFieldName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      firstName: 'Nome',
      lastName: 'Cognome',
      email: 'Email',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Conferma Password',
      acceptTerms: 'Accettazione termini'
    };
    return fieldNames[field] || field;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
