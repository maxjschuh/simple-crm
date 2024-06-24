import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContactsTableComponent } from '../../contacts/contacts-table/contacts-table.component';
import { DateService } from '../../services/date/date.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Employee } from '../../models/employee.class';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { Subscription, Observable, startWith, map } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonService } from '../../services/common/common.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment, { Moment } from 'moment';


const CUSTOM_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};


@Component({
  selector: 'app-dialog-edit-employee',
  standalone: true,
  imports: [FormsModule,
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
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMAT }
  ],
  templateUrl: './dialog-edit-employee.component.html',
  styleUrl: './dialog-edit-employee.component.scss'
})
export class DialogEditEmployeeComponent implements OnInit {

  employeesSubscriber = new Subscription;
  employees: Employee[] = [];

  employeePicker = new FormControl({ value: '', disabled: false });
  employeePickerOptions: string[] = [];
  employeePickerFilteredOptions!: Observable<string[]>;

  employee: Employee;
  birthDate: Moment | undefined = undefined;
  loading = false;
  fieldsToEdit: string;

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogEditEmployeeComponent>,
    public firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {

    this.employee = data.document;
    this.employeePicker = new FormControl({ value: this.employee.supervisor, disabled: false });

    this.fieldsToEdit = data.fieldsToEdit;
    this.birthDate = this.employee.birthDate ? moment(this.employee.birthDate) : undefined;

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe(employees => {
          this.employees = employees;
        });;
  }


  /**
   * Creates a Angular Material Form, which controls the input fields in this dialog component. Initializes the employee picker (used in the "supervisor" input field).
   */
  ngOnInit(): void {

    this.form = this.fb.group({
      firstName: [this.employee.firstName, Validators.required],
      lastName: [this.employee.lastName, Validators.required],
      birthDate: [''],
      email: [this.employee.email, [Validators.required, Validators.email]],
      phone: [''],
      position: [''],
      department: [''],
      supervisor: ['']
    });

    this.employeePickerOptions = this.commonService.returnDataForPersonPicker(this.employees);

    this.employeePickerFilteredOptions = this.employeePicker.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }


  /**
   * Unsubscribes from all subscriptions in this component.
   */
  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
  }


  /**
   * Filters the available persons in the employee picker by the user input.
   * @param value string that the user typed into the input field
   * @returns array of employee names
   */
  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();

    return this.employeePickerOptions.filter(option => option.toLowerCase().includes(filterValue));
  }


  /**
   * Closes this dialog. Is called when the user clicks outside of the dialog or the "cancel"-button.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }


  /**
   * Saves the edited employee with the inputted data to the database and closes the dialog.
   * @returns if the form is not filled in with valid data
   */
  async saveEdits(): Promise<void> {

    if (!this.form.valid) return;

    this.addSupervisorFromPicker();
    this.setDialogLoading();
    this.employee.birthDate = this.birthDate ? this.birthDate.valueOf() : undefined;

    await this.firestoreService.updateDocument('employees', this.employee.id, this.employee.toJSON());

    setTimeout(() => this.dialogRef.close(), 1000);
  }


  /**
   * Shows a loading / progress bar and disables all input fields and buttons.
   */
  setDialogLoading(): void {

    this.loading = true;
    const fieldIds = ['firstName', 'lastName', 'birthDate', 'email', 'phone', 'position', 'department', 'supervisor'];

    fieldIds.forEach(id => {

      this.form.get(id)?.disable();
    });
  }


  /**
   * Adds the supervisor and the corresponding document id to the employee object.
   * @returns if there is no supervisor selected in the employee picker, i.e. the supervisor field is empty
   */
  addSupervisorFromPicker(): void {

    this.employee.supervisor = '';
    this.employee.supervisorId = '';

    const supervisorName = this.employeePicker.value;

    if (!supervisorName) return;

    this.employee.supervisor = supervisorName;
    this.employee.supervisorId = this.commonService.returnIdByName(supervisorName, this.employees);
  }
}