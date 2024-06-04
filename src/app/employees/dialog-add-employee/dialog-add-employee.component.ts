import { DateService } from '../../services/date/date.service';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe, NgIf } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Employee } from '../../models/employee.class';
import { FormControl, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { CommonService } from '../../services/common/common.service';


@Component({
  selector: 'app-dialog-add-employee',
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
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-add-employee.component.html',
  styleUrl: './dialog-add-employee.component.scss'
})
export class DialogAddEmployeeComponent implements OnInit {

  employeesSubscriber = new Subscription;
  employees: Employee[] = [];

  employee = new Employee();
  birthDate: Date | undefined = undefined;
  loading = false;

  employeePicker = new FormControl({ value: '', disabled: false });
  employeePickerOptions: string[] = [];
  employeePickerFilteredOptions!: Observable<string[]>;

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAddEmployeeComponent>,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService,
    private fb: FormBuilder
  ) {

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe(employees => {
          this.employees = employees;
        });;
  }


  ngOnInit(): void {

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: [''],
      email: ['', [Validators.required, Validators.email]],
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


  async saveEmployee(): Promise<void> {

    if (!this.form.valid) return;

    this.addSupervisorFromPicker();
    this.setDialogLoading();
    this.employee.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;

    await this.firestoreService.addDocument('employees', this.employee.toJSON());

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
