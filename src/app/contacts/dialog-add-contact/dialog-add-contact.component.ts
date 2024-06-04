import { DateService } from '../../services/date/date.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    NgIf,
    ReactiveFormsModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-add-contact.component.html',
  styleUrl: './dialog-add-contact.component.scss'
})
export class DialogAddContactComponent implements OnInit {

  contact = new Contact();
  birthDate: Date | undefined = undefined;
  loading = false;

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAddContactComponent>,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: [''],
      email: ['', [Validators.required, Validators.email]],
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


  async saveContact(): Promise<void> {

    if (!this.form.valid) return;

    this.setDialogLoading();
    this.contact.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;

    await this.firestoreService.addDocument('contacts', this.contact.toJSON());

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