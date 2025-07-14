import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-issue-dialog',
  imports: [MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './delete-issue-dialog.html',
  styleUrl: './delete-issue-dialog.css'
})
export class DeleteIssueDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteIssueDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { issueId: number, issueTitle: string }
  ) {}

  onDelete(): void {
    this.dialogRef.close({ success: true });
  }
}
