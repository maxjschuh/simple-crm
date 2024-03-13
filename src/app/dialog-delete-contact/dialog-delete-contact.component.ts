import { Component, Inject } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { User } from '../models/user.class';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-dialog-delete-contact',
  standalone: true,
  imports: [MatDialogContent, MatCheckboxModule, MatDialogActions, MatDialogClose, MatProgressBarModule, MatButtonModule, MatDialogTitle, NgIf, FormsModule, MatTooltipModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-delete-contact.component.html',
  styleUrl: './dialog-delete-contact.component.scss'
})
export class DialogDeleteContactComponent {

  user: User;
  loading = false;
  deletionConfirmed = false;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteContactComponent>,
    public firestoreService: FirestoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async deleteContact() {

    this.loading = true;
    await this.firestoreService.deleteDocument('users', this.user.id);

    setTimeout(() => {

      this.loading = false;
      this.deletionConfirmed = false;
      this.dialogRef.close();
    }, 1000);
  }
}
