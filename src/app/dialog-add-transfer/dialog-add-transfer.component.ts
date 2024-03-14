import { DateService } from '../services/date/date.service';
import { Component } from '@angular/core';
import { FirestoreService } from '../services/firestore/firestore.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Transfer } from '../models/transfer.class';

import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dialog-add-transfer',
  standalone: true,
  imports: [FormsModule,
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
    MatSelectModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-add-transfer.component.html',
  styleUrl: './dialog-add-transfer.component.scss'
})
export class DialogAddTransferComponent {

  transfer = new Transfer();
  date: Date | undefined = undefined;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<DialogAddTransferComponent>,
    private firestoreService: FirestoreService,
    public dateService: DateService
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveTransfer() {

    this.loading = true;
    this.transfer.date = this.date ? this.date.getTime() : undefined;

    const response = await this.firestoreService.addDocument('transfers', this.transfer.toJSON());
    
    setTimeout(() => {
      
      this.loading = false;
      this.dialogRef.close();
    }, 2000);
  }
}