import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './logout-dialog.component.html',
  styleUrl: './logout-dialog.component.css'
})
export class LogoutDialogComponent {
  
  // Costruttore - inizializza il riferimento al dialog
  constructor(
    private dialogRef: MatDialogRef<LogoutDialogComponent>
  ) {}

  // Conferma il logout e chiude il dialog
  confirmLogout(): void {
    this.dialogRef.close(true);
  }

  // Annulla il logout e chiude il dialog
  cancelLogout(): void {
    this.dialogRef.close(false);
  }
}