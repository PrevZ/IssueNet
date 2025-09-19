import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-project-dialog',
  templateUrl: './delete-project-dialog.html',
  styleUrl: './delete-project-dialog.css',
  imports: [MatIconModule, MatButtonModule, MatDialogModule]
})
export class DeleteProjectDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteProjectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number, projectName: string }
  ) {}

  onDelete(): void {
    this.dialogRef.close({ success: true });
  }
}
