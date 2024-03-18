import { DateService } from '../../services/date/date.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Transfer } from '../../models/transfer.class';

import { MatSelectModule } from '@angular/material/select';


import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Contact } from '../../models/contact.class';

@Component({
  selector: 'app-dialog-add-transfer',
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
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-add-transfer.component.html',
  styleUrl: './dialog-add-transfer.component.scss'
})
export class DialogAddTransferComponent implements OnInit {



  transfer = new Transfer();
  date: Date | undefined = undefined;
  loading = false;

  contactsSubscriber = new Subscription;
  contactsList: Contact[] = [];


  personPicker = new FormControl({value: '', disabled: false});
  personPickerOptions: string[] = [];
  personPickerFilteredOptions!: Observable<string[]>;

  constructor(
    public dialogRef: MatDialogRef<DialogAddTransferComponent>,
    private firestoreService: FirestoreService,
    public dateService: DateService
  ) { 

     this.contactsSubscriber = this.firestoreService.contactsFrontendDistributor.subscribe((contactsList: Contact[]) => {

      this.contactsList = contactsList;
    });
  }


  createDataForPersonsPicker() {

    for (let i = 0; i < this.contactsList.length; i++) {
      const contact = this.contactsList[i];
      
      const fullName = contact.firstName + ' ' + contact.lastName;

      this.personPickerOptions.push(fullName);
    }
  }

  ngOnInit() {

    this.createDataForPersonsPicker();

    this.personPickerFilteredOptions = this.personPicker.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.personPickerOptions.filter(option => option.toLowerCase().includes(filterValue));
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveTransfer() {

    this.personPicker = new FormControl({value: '', disabled: true});

    this.loading = true;
    this.transfer.date = this.date ? this.date.getTime() : 0;

    const response = await this.firestoreService.addDocument('transfers', this.transfer.toJSON());
    
    setTimeout(() => {
      
      this.loading = false;
      this.dialogRef.close();
    }, 2000);
  }
}
