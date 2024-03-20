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
import { CommonService } from '../../services/common/common.service';

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

  payerPicker = new FormControl({ value: '', disabled: false });
  payerPickerOptions: string[] = [];
  payerPickerFilteredOptions!: Observable<string[]>;

  recipientPicker = new FormControl({ value: '', disabled: false });
  recipientPickerOptions: string[] = [];
  recipientPickerFilteredOptions!: Observable<string[]>;

  employeePicker = new FormControl({ value: '', disabled: false });
  employeePickerOptions: string[] = [];
  employeePickerFilteredOptions!: Observable<string[]>;

  selectedPersonIndex = {
    payerPicker: 0,
    recipientPicker: 0,
    employeePicker: 0
  }

  constructor(
    public dialogRef: MatDialogRef<DialogAddTransferComponent>,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService
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

    this.payerPickerOptions = this.returnDataForPersonPicker(this.contacts);
    this.recipientPickerOptions = this.returnDataForPersonPicker(this.contacts);
    this.employeePickerOptions = this.returnDataForPersonPicker(this.employees);

    this.payerPickerFilteredOptions = this.payerPicker.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.payerPickerOptions)),
    );

    this.recipientPickerFilteredOptions = this.recipientPicker.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.recipientPickerOptions)),
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

    this.addPersonFromPicker('payer', 'payerId', this.recipientPicker.value, this.contacts);
    this.addPersonFromPicker('recipient', 'recipientId', this.payerPicker.value, this.contacts);
    this.addPersonFromPicker('closedBy', 'closedById', this.employeePicker.value, this.employees);

    this.payerPicker = new FormControl({ value: '', disabled: true });
    this.recipientPicker = new FormControl({ value: '', disabled: true });
    this.employeePicker = new FormControl({ value: '', disabled: true });

    this.loading = true;
    this.transfer.date = this.date ? this.date.getTime() : 0;

    const response = await this.firestoreService.addDocument('transfers', this.transfer.toJSON());

    setTimeout(() => {

      this.loading = false;
      this.dialogRef.close();
    }, 2000);
  }


  addPersonFromPicker(
    nameField: 'recipient' | 'payer' | 'closedBy',
    idField: 'recipientId' | 'payerId' | 'closedById',
    name: string | null,
    collection: Employee[] | Contact[]): void {

    if (!name) return;

    this.transfer[nameField] = name;
    this.transfer[idField] = this.commonService.returnIdByName(name, collection);
  }


  savePersonIndex(
    isUserInput: boolean,
    pickerId: 'payer' | 'recipient' | 'employee',
    personIndex: number): void {

    if (!isUserInput) return;

    switch (pickerId) {

      case 'payer': this.selectedPersonIndex.payerPicker = personIndex;
        break;

      case 'recipient': this.selectedPersonIndex.recipientPicker = personIndex;
        break;

      case 'employee': this.selectedPersonIndex.employeePicker = personIndex;
        break

      default:
        break;
    }
  }
}
