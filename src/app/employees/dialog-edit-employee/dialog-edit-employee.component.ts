import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
export class DialogEditEmployeeComponent {

  employeesSubscriber = new Subscription;
  employees: Employee[] = [];

  employeePicker = new FormControl({ value: '', disabled: false });
  employeePickerOptions: string[] = [];
  employeePickerFilteredOptions!: Observable<string[]>;

  employee: Employee;
  birthDate: Date | undefined = undefined;
  loading = false;
  fieldsToEdit: string;

  @Output() savedEdits = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<DialogEditEmployeeComponent>,
    public firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any
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


  emitEvent(data: any): void {
    this.savedEdits.emit(data);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveEdits(): Promise<void> {

    this.addSupervisorFromPicker();

    this.employeePicker = new FormControl({ value: '', disabled: true });
    this.loading = true;

    this.employee.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;

    await this.firestoreService.updateDocument('employees', this.employee.id, this.employee.toJSON());

    setTimeout(() => {

      this.loading = false;
      this.emitEvent(this.employee)
      this.dialogRef.close();
    }, 2000);
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