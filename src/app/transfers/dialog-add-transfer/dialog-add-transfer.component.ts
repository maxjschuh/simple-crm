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
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Contact } from '../../models/contact.class';
import { Employee } from '../../models/employee.class';

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

  contactsSubscriber = new Subscription;
  contacts: Contact[] = [];

  employeesSubscriber = new Subscription;
  employees: Employee[] = [];

  transfer = new Transfer();
  date: Date | undefined = undefined;
  loading = false;

  contactPicker1 = new FormControl({ value: '', disabled: false });
  contactPickerOptions1: string[] = [];
  contactPickerFilteredOptions1!: Observable<string[]>;

  contactPicker2 = new FormControl({ value: '', disabled: false });
  contactPickerOptions2: string[] = [];
  contactPickerFilteredOptions2!: Observable<string[]>;

  employeePicker = new FormControl({ value: '', disabled: false });
  employeePickerOptions: string[] = [];
  employeePickerFilteredOptions!: Observable<string[]>;

  selectedPersonIndex = {
    contactPicker1: 0,
    contactPicker2: 0,
    employeePicker: 0
  }

  constructor(
    public dialogRef: MatDialogRef<DialogAddTransferComponent>,
    private firestoreService: FirestoreService,
    public dateService: DateService
  ) {

    this.contactsSubscriber =
      this.firestoreService
        .contactsFrontendDistributor
        .subscribe(contacts => {
          this.contacts = contacts;
        });

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe(employees => {
          this.employees = employees;
        });;
  }

  ngOnInit(): void {

    this.contactPickerOptions1 = this.returnDataForPersonPicker(this.contacts);
    this.contactPickerOptions2 = this.returnDataForPersonPicker(this.contacts);
    this.employeePickerOptions = this.returnDataForPersonPicker(this.employees);

    this.contactPickerFilteredOptions1 = this.contactPicker1.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.contactPickerOptions1)),
    );

    this.contactPickerFilteredOptions2 = this.contactPicker2.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.contactPickerOptions2)),
    );

    this.employeePickerFilteredOptions = this.employeePicker.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.employeePickerOptions)),
    );
  }


  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
    this.contactsSubscriber.unsubscribe();
  }


  private _filter(value: string, pickerOptions: string[]): string[] {
    const filterValue = value.toLowerCase();

    return pickerOptions.filter(option => option.toLowerCase().includes(filterValue));
  }


  returnDataForPersonPicker(collection: Contact[] | Employee[]): string[] {

    let pickerOptions = [];

    for (let i = 0; i < collection.length; i++) {
      const person = collection[i];

      const fullName = person.firstName + ' ' + person.lastName;

      pickerOptions.push(fullName);
    }

    return pickerOptions;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveTransfer(): Promise<void> {

    this.contactPicker1 = new FormControl({ value: '', disabled: true });

    this.loading = true;
    this.transfer.date = this.date ? this.date.getTime() : 0;

    const response = await this.firestoreService.addDocument('transfers', this.transfer.toJSON());

    setTimeout(() => {

      this.loading = false;
      this.dialogRef.close();
    }, 2000);
  }


  savePersonIndex(
    isUserInput: boolean,
    pickerId: 'contact1' | 'contact2' | 'employee', 
    personIndex: number): void {

    if (!isUserInput) return;

    switch (pickerId) {
      
      case 'contact1': this.selectedPersonIndex.contactPicker1 = personIndex;
        break;

      case 'contact2': this.selectedPersonIndex.contactPicker2 = personIndex;
        break;

      case 'employee': this.selectedPersonIndex.employeePicker = personIndex;
        break

      default:
        break;
    }
  }
}
