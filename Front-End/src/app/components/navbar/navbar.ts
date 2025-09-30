import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, MatSnackBarModule, MatDialogModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  currentUser: User | null = null;
  isMobileMenuOpen: boolean = false;

  // Costruttore - inizializza i servizi necessari
  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  // Inizializzazione del component
  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Chiudi il menu mobile quando cambia la rotta
    this.router.events.subscribe(() => {
      this.closeMobileMenu();
    });
  }
  
  // Gestisce il logout dell'utente mostrando il dialog di conferma
  logout(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '400px',
      disableClose: true,
      panelClass: 'logout-dialog-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.performLogout();
      }
    });
  }
  
  // Toggle del menu mobile
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Previeni lo scroll del body quando il menu è aperto
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  // Chiudi il menu mobile
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  // Esegue il logout completo dell'utente
  private performLogout(): void {
    // Chiudi il menu mobile se aperto
    this.closeMobileMenu();

    // Pulisce lo stato dell'utente
    this.userService.logout();

    // Mostra messaggio di conferma
    this.snackBar.open('Logout effettuato con successo!', 'Chiudi', {
      duration: 3000,
      panelClass: ['success-snack']
    });

    // Reindirizza alla home page
    this.router.navigate(['/home']);
  }
}
