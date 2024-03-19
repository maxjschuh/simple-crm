import { DateService } from '../../services/date/date.service';
import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Contact } from '../../models/contact.class';


@Component({
  selector: 'app-dialog-add-contact',
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
    NgIf
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-add-contact.component.html',
  styleUrl: './dialog-add-contact.component.scss'
})
export class DialogAddContactComponent {

  contact = new Contact();
  birthDate: Date | undefined = undefined;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<DialogAddContactComponent>,
    private firestoreService: FirestoreService,
    public dateService: DateService
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveContact(): Promise<void> {

    this.loading = true;
    this.contact.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;

    const response = await this.firestoreService.addDocument('contacts', this.contact.toJSON());
    
    setTimeout(() => {
      
      this.loading = false;
      this.dialogRef.close();
    }, 2000);
  }
}