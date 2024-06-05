import { DateService } from '../../services/date/date.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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

  payerPicker: AbstractControl | null = null;
  payerPickerOptions: string[] = [];
  payerPickerFilteredOptions = new Observable<string[]>;

  recipientPicker: AbstractControl | null = null;
  recipientPickerOptions: string[] = [];
  recipientPickerFilteredOptions = new Observable<string[]>;

  employeePicker: AbstractControl | null = null;
  employeePickerOptions: string[] = [];
  employeePickerFilteredOptions = new Observable<string[]>;

  selectedPersonIndex = { //not yet in use
    payerPicker: 0,
    recipientPicker: 0,
    employeePicker: 0
  }

  changedTypeBefore = false;
  readonly demoOwner = 'Doe Demo-Owner, John';

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAddTransferComponent>,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService,
    private fb: FormBuilder
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

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      type: ['', Validators.required],
      amount: ['', [Validators.required, this.commonService.greaterThanZeroValidator()]],
      payer: ['', Validators.required],
      recipient: ['', Validators.required],
      date: ['', Validators.required],
      closedBy: ['', Validators.required],
    });

    this.payerPickerOptions = this.commonService.returnDataForPersonPicker(this.contacts);
    this.recipientPickerOptions = this.commonService.returnDataForPersonPicker(this.contacts);
    this.employeePickerOptions = this.commonService.returnDataForPersonPicker(this.employees);

    this.payerPicker = this.form.get('payer');
    this.recipientPicker = this.form.get('recipient');
    this.employeePicker = this.form.get('closedBy');


    if (this.payerPicker && this.recipientPicker && this.employeePicker) {

      this.payerPickerFilteredOptions = this.payerPicker.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '', this.payerPickerOptions))
      );

      this.recipientPickerFilteredOptions = this.recipientPicker.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '', this.recipientPickerOptions)),
      );

      this.employeePickerFilteredOptions = this.employeePicker.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '', this.employeePickerOptions)),
      );

    } else throw new Error('Component did not initialize correctly');

  }


  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
    this.contactsSubscriber.unsubscribe();
  }


  private _filter(value: string, pickerOptions: string[]): string[] {
    const filterValue = value.toLowerCase();

    return pickerOptions.filter(option => option.toLowerCase().includes(filterValue));
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveTransfer(): Promise<void> {

    if (!this.form.valid) return;

    this.setDialogLoading();

    this.addPersonFromPicker('payer', 'payerId', this.payerPicker?.value, this.contacts);
    this.addPersonFromPicker('recipient', 'recipientId', this.recipientPicker?.value, this.contacts);
    this.addPersonFromPicker('closedBy', 'closedById', this.employeePicker?.value, this.employees);

    this.transfer.date = this.date ? this.date.getTime() : 0;

    await this.firestoreService.addDocument('transfers', this.transfer.toJSON());

    setTimeout(() => this.dialogRef.close(), 2000);
  }


  setDialogLoading(): void {

    this.loading = true;
    const fieldIds = ['title', 'description', 'type', 'amount', 'payer', 'recipient', 'date', 'closedBy'];

    fieldIds.forEach(id => {

      this.form.get(id)?.disable();
    });
  }


  addPersonFromPicker(
    nameField: 'recipient' | 'payer' | 'closedBy',
    idField: 'recipientId' | 'payerId' | 'closedById',
    name: string | null,
    collection: Employee[] | Contact[]): void {

    this.transfer[nameField] = '';
    this.transfer[idField] = '';

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


  setPayerRecipient(type: string): void {

    if (this.changedTypeBefore) {

      this.payerPicker?.setValue('');
      this.payerPicker?.enable();

      this.recipientPicker?.setValue('');
      this.recipientPicker?.enable();
    }

    if (type === 'Sale') {

      this.recipientPicker?.setValue(this.demoOwner);
      this.recipientPicker?.disable();

    } else {

      this.payerPicker?.setValue(this.demoOwner);
      this.payerPicker?.disable();
    }

    this.changedTypeBefore = true;
  }
}
