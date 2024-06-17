import { NgIf, AsyncPipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
export class DialogEditTransferComponent implements OnInit {

  contactsSubscriber = new Subscription;
  contacts: Contact[] = [];

  employeesSubscriber = new Subscription;
  employees: Employee[] = [];

  transfer: Transfer;
  date: Date | undefined = undefined;
  loading = false;
  fieldsToEdit: string;

  payerPicker: AbstractControl | null = null;
  payerPickerOptions: string[] = [];
  payerPickerFilteredOptions = new Observable<string[]>;

  recipientPicker: AbstractControl | null = null;
  recipientPickerOptions: string[] = [];
  recipientPickerFilteredOptions = new Observable<string[]>;

  employeePicker: AbstractControl | null = null;
  employeePickerOptions: string[] = [];
  employeePickerFilteredOptions = new Observable<string[]>;

  changedTypeBefore = false;
  readonly demoOwner = 'Doe Demo-Owner, John';

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogEditTransferComponent>,
    public firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
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


    this.transfer = data.document;
    this.fieldsToEdit = data.fieldsToEdit;

    this.date = this.transfer.date ? new Date(this.transfer.date) : undefined;
  }


  /**
   * Creates a Angular Material Form, which controls the input fields in this dialog component. Initializes the person pickers for the input fields "payer", "recipient" and "closedBy".
   */
  ngOnInit(): void {

    this.form = this.fb.group({
      title: [this.transfer.title, Validators.required],
      description: [''],
      type: [this.transfer.type, Validators.required],
      amount: [this.transfer.amount, [Validators.required, this.commonService.greaterThanZeroValidator()]],
      payer: [this.transfer.payer, Validators.required],
      recipient: [this.transfer.recipient, Validators.required],
      date: [this.transfer.date, Validators.required],
      closedBy: [this.transfer.closedBy, Validators.required],
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

    this.setPayerRecipient(this.transfer.type!);
  }


  /**
   * Unsubscribes from all subscriptions in this component.
   */
  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
    this.contactsSubscriber.unsubscribe();
  }


  /**
   * Filters the available persons in the person picker by the user input.
   * @param value string that the user typed into the input field
   * @param pickerOptions array of strings that should be returned filtered
   * @returns array of names
   */
  private _filter(value: string, pickerOptions: string[]): string[] {
    const filterValue = value.toLowerCase();

    return pickerOptions.filter(option => option.toLowerCase().includes(filterValue));
  }


  /**
   * Closes this dialog. Is called when the user clicks outside of the dialog or the "cancel"-button.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Saves the edited transfer (called "transaction" in the UI) with the inputted data to the database and closes the dialog.
   * @returns if the form is not filled in with valid data
   */
  async saveEdits(): Promise<void> {

    if (!this.form.valid) return;

    this.setDialogLoading();

    this.addPersonFromPicker('payer', 'payerId', this.payerPicker?.value, this.contacts);
    this.addPersonFromPicker('recipient', 'recipientId', this.recipientPicker?.value, this.contacts);
    this.addPersonFromPicker('closedBy', 'closedById', this.employeePicker?.value, this.employees);

    this.transfer.date = this.date ? this.date.getTime() : 0;

    await this.firestoreService.updateDocument('transfers', this.transfer.id, this.transfer.toJSON());

    setTimeout(() => this.dialogRef.close(), 2000);
  }


  /**
   * Shows a loading / progress bar and disables all input fields and buttons.
   */
  setDialogLoading(): void {

    this.loading = true;
    const fieldIds = ['title', 'description', 'type', 'amount', 'payer', 'recipient', 'date', 'closedBy'];

    fieldIds.forEach(id => {

      this.form.get(id)?.disable();
    });
  }


  /**
   * Adds a person and the corresponding document id to a specific key in the transfer object.
   * @param nameField key in the transfer object where the name of the person should be saved
   * @param idField key in the transfer object where the corresponding document id should be saved
   * @param name of the person
   * @param collection where the person should found in (Employees or Contacts)
   * @returns if there is no supervisor selected in the specific picker, i.e. the input field is empty
   */
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


  /**
   * When the user chooses "sale" as transaction action, this function fills in the CRM Owner in the "recipient" input field, otherwise in the "payer" input field.
   * @param type of transfer (called "transaction" in the UI): "Sale", "Purchase" or "Refund"
   */
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