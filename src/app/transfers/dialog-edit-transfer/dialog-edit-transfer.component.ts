import { NgIf, AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { DateService } from '../../services/date/date.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Transfer } from '../../models/transfer.class';

@Component({
  selector: 'app-dialog-edit-transfer',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    NgIf,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './dialog-edit-transfer.component.html',
  styleUrl: './dialog-edit-transfer.component.scss'
})
export class DialogEditTransferComponent {

  transfer: Transfer;
  date: Date | undefined = undefined;
  loading = false;
  fieldsToEdit: string;

  @Output() savedEdits = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<DialogEditTransferComponent>,
    public firestoreService: FirestoreService,
    public dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.transfer = data.document;
    this.fieldsToEdit = data.fieldsToEdit;
    this.date = this.transfer.date ? new Date(this.transfer.date) : undefined;
  }


  emitEvent(data: any): void {
    this.savedEdits.emit(data);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  async saveEdits(): Promise<void> {

    this.loading = true;

    this.transfer.date = this.date ? this.date.getTime() : 0;

    await this.firestoreService.updateDocument('contacts', this.transfer.id, this.transfer.toJSON());

    setTimeout(() => {

      this.loading = false;
      this.emitEvent(this.transfer)
      this.dialogRef.close();
    }, 2000);
  }
}
