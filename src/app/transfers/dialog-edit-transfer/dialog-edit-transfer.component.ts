import { NgIf, AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { Observable, Subscription, map, startWith } from 'rxjs';
import { Contact } from '../../models/contact.class';
import { Employee } from '../../models/employee.class';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonService } from '../../services/common/common.service';

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
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-edit-transfer.component.html',
  styleUrl: './dialog-edit-transfer.component.scss'
})
export class DialogEditTransferComponent {

  contactsSubscriber = new Subscription;
  contacts: Contact[] = [];

  employeesSubscriber = new Subscription;
  employees: Employee[] = [];
  
  transfer: Transfer;
  date: Date | undefined = undefined;
  loading = false;
  fieldsToEdit: string;

  payerPicker = new FormControl({ value: '', disabled: false });
  payerPickerOptions: string[] = [];
  payerPickerFilteredOptions!: Observable<string[]>;

  recipientPicker = new FormControl({ value: '', disabled: false });
  recipientPickerOptions: string[] = [];
  recipientPickerFilteredOptions!: Observable<string[]>;

  employeePicker = new FormControl({ value: '', disabled: false });
  employeePickerOptions: string[] = [];
  employeePickerFilteredOptions!: Observable<string[]>;

  @Output() savedEdits = new EventEmitter<any>();


  constructor(
    public dialogRef: MatDialogRef<DialogEditTransferComponent>,
    public firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
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


    this.transfer = data.document;
    this.fieldsToEdit = data.fieldsToEdit;

    this.payerPicker = new FormControl({value: this.transfer.payer, disabled: false});
    this.recipientPicker = new FormControl({value: this.transfer.recipient, disabled: false});
    this.employeePicker = new FormControl({value: this.transfer.closedBy, disabled: false});

    this.date = this.transfer.date ? new Date(this.transfer.date) : undefined;
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


  emitEvent(data: any): void {
    this.savedEdits.emit(data);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveEdits(): Promise<void> {

    this.addPersonFromPicker('payer', 'payerId', this.recipientPicker.value, this.contacts);
    this.addPersonFromPicker('recipient', 'recipientId', this.payerPicker.value, this.contacts);
    this.addPersonFromPicker('closedBy', 'closedById', this.employeePicker.value, this.employees);

    this.payerPicker = new FormControl({ value: '', disabled: true });
    this.recipientPicker = new FormControl({ value: '', disabled: true });
    this.employeePicker = new FormControl({ value: '', disabled: true });
    this.loading = true;

    this.transfer.date = this.date ? this.date.getTime() : 0;

    await this.firestoreService.updateDocument('contacts', this.transfer.id, this.transfer.toJSON());

    setTimeout(() => {

      this.loading = false;
      this.emitEvent(this.transfer)
      this.dialogRef.close();
    }, 2000);
  }


  addPersonFromPicker(
    nameField: 'recipient' | 'payer' | 'closedBy',
    idField: 'recipientId' | 'payerId' | 'closedById',
    name: string | null,
    collection: Employee[] | Contact[]): void {

    this.transfer[nameField] = '';
    this.transfer[idField] = '';

    if (!name) return;

    this.transfer[nameField] = this.commonService.returnFormattedName(name);
    this.transfer[idField] = this.commonService.returnIdByName(name, collection);
  }
}
