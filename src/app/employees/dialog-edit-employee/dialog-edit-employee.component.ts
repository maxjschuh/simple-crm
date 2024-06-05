import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
  providers: [provideNativeDateAdapter()],
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
  birthDate: Date | undefined = undefined;
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
    this.birthDate = this.employee.birthDate ? new Date(this.employee.birthDate) : undefined;

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe(employees => {
          this.employees = employees;
        });;
  }


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


  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
  }


  private _filter(value: string): string[] {

    const filterValue = value.toLowerCase();

    return this.employeePickerOptions.filter(option => option.toLowerCase().includes(filterValue));
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveEdits(): Promise<void> {

    if (!this.form.valid) return;

    this.addSupervisorFromPicker();
    this.setDialogLoading();
    this.employee.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;
    
    await this.firestoreService.updateDocument('employees', this.employee.id, this.employee.toJSON());
    
    setTimeout(() => this.dialogRef.close(), 2000);
  }


  setDialogLoading(): void {

    this.loading = true;
    const fieldIds = ['firstName', 'lastName', 'birthDate', 'email', 'phone', 'position', 'department', 'supervisor'];

    fieldIds.forEach(id => {

      this.form.get(id)?.disable();
    });
  }


  addSupervisorFromPicker(): void {

    this.employee.supervisor = '';
    this.employee.supervisorId = '';

    const supervisorName = this.employeePicker.value;

    if (!supervisorName) return;

    this.employee.supervisor = supervisorName;
    this.employee.supervisorId = this.commonService.returnIdByName(supervisorName, this.employees);
  }
}