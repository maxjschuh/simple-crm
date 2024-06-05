import { DateService } from '../../services/date/date.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    ContactsTableComponent,
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-edit-contact.component.html',
  styleUrl: './dialog-edit-contact.component.scss'
})
export class DialogEditContactComponent implements OnInit {

  contact: Contact;
  birthDate: Date | undefined = undefined;
  loading = false;
  fieldsToEdit: string;

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogEditContactComponent>,
    public firestoreService: FirestoreService,
    public dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.contact = data.document;
    this.fieldsToEdit = data.fieldsToEdit;
    this.birthDate = this.contact.birthDate ? new Date(this.contact.birthDate) : undefined;
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      firstName: [this.contact.firstName, Validators.required],
      lastName: [this.contact.lastName, Validators.required],
      birthDate: [''],
      email: [this.contact.email, [Validators.required, Validators.email]],
      phone: [''],
      street: [''],
      houseNumber: [''],
      zipCode: [''],
      city: [''],
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveEdits(): Promise<void> {

    if (!this.form.valid) return;

    this.setDialogLoading();

    this.contact.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;

    await this.firestoreService.updateDocument('contacts', this.contact.id, this.contact.toJSON());

    setTimeout(() => this.dialogRef.close(), 2000);
  }

  
  setDialogLoading(): void {

    this.loading = true;
    const fieldIds = ['firstName', 'lastName', 'birthDate', 'email', 'phone', 'street', 'houseNumber', 'zipCode', 'city'];

    fieldIds.forEach(id => {

      this.form.get(id)?.disable();
    });
  }
}
