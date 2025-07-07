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

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, MatSnackBarModule, MatDialogModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  currentUser: User | null = null;
  
  constructor(
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    // Sottoscrivi agli aggiornamenti dell'utente corrente
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
  
  logout(): void {
    // Per ora logout diretto, potremo aggiungere conferma in futuro
    this.performLogout();
  }
  
  private performLogout(): void {
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
