import { DateService } from '../../services/date/date.service';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Contact } from '../../models/contact.class';
import { ContactsTableComponent } from '../contacts-table/contacts-table.component';


@Component({
  selector: 'app-dialog-edit-contact',
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
    ContactsTableComponent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-edit-contact.component.html',
  styleUrl: './dialog-edit-contact.component.scss'
})
export class DialogEditContactComponent {

  contact: Contact;
  birthDate: Date | undefined = undefined;
  loading = false;
  fieldsToEdit: string;

  @Output() savedEdits = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<DialogEditContactComponent>,
    public firestoreService: FirestoreService,
    public dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.contact = data.document;
    this.fieldsToEdit = data.fieldsToEdit;
    this.birthDate = this.contact.birthDate ? new Date(this.contact.birthDate) : undefined;
  }


  emitEvent(data: any): void {
    this.savedEdits.emit(data);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveEdits(): Promise<void> {

    this.loading = true;

    this.contact.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;

    await this.firestoreService.updateDocument('contacts', this.contact.id, this.contact.toJSON());

    setTimeout(() => {

      this.loading = false;
      this.emitEvent(this.contact);
      this.dialogRef.close();
    }, 2000);
  }
}
