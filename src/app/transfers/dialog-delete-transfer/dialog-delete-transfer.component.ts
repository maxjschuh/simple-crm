import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogDeleteContactComponent } from '../../contacts/dialog-delete-contact/dialog-delete-contact.component';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Transfer } from '../../models/transfer.class';
import { DateService } from '../../services/date/date.service';

@Component({
  selector: 'app-dialog-delete-transfer',
  standalone: true,
  imports: [MatDialogContent, MatCheckboxModule, MatDialogActions, MatDialogClose, MatProgressBarModule, MatButtonModule, MatDialogTitle, NgIf, FormsModule, MatTooltipModule],
  templateUrl: './dialog-delete-transfer.component.html',
  styleUrl: './dialog-delete-transfer.component.scss'
})
export class DialogDeleteTransferComponent {

  loading = false;
  deletionConfirmed = false;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteContactComponent>,
    public firestoreService: FirestoreService,
    public dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public transfer: Transfer
  ) { }


  /**
   * Closes this dialog. Is called when the user clicks outside of the dialog or the "cancel"-button.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  
  /**
   * Deletes the transfer (called "transaction in the UI") from the database and closes the dialog.
   */
  async deleteTransfer(): Promise<void> {

    this.loading = true;
    await this.firestoreService.deleteDocument('transfers', this.transfer.id);

    setTimeout(() => {

      this.loading = false;
      this.deletionConfirmed = false;
      this.dialogRef.close();
    }, 1000);
  }
}