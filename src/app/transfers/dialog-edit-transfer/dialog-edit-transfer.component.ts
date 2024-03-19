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

  contactPicker1 = new FormControl({ value: '', disabled: false });
  contactPickerOptions1: string[] = [];
  contactPickerFilteredOptions1!: Observable<string[]>;

  contactPicker2 = new FormControl({ value: '', disabled: false });
  contactPickerOptions2: string[] = [];
  contactPickerFilteredOptions2!: Observable<string[]>;

  employeePicker = new FormControl({ value: '', disabled: false });
  employeePickerOptions: string[] = [];
  employeePickerFilteredOptions!: Observable<string[]>;

  @Output() savedEdits = new EventEmitter<any>();


  constructor(
    public dialogRef: MatDialogRef<DialogEditTransferComponent>,
    public firestoreService: FirestoreService,
    public dateService: DateService,
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
    this.date = this.transfer.date ? new Date(this.transfer.date) : undefined;
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


  emitEvent(data: any): void {
    this.savedEdits.emit(data);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveEdits(): Promise<void> {

    this.loading = true;

    this.transfer.date = this.date ? this.date.getTime() : 0;

    await this.firestoreService.updateDocument('contacts', this.transfer.id, this.transfer.toJSON());

    setTimeout(() => {

      this.loading = false;
      this.emitEvent(this.transfer)
      this.dialogRef.close();
    }, 2000);
  }
}
