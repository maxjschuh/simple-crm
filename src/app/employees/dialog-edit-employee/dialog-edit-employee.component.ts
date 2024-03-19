import { NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    ContactsTableComponent
  ],
  templateUrl: './dialog-edit-employee.component.html',
  styleUrl: './dialog-edit-employee.component.scss'
})
export class DialogEditEmployeeComponent {

  employee: Employee;
  birthDate: Date | undefined = undefined;
  loading = false;
  fieldsToEdit: string;

  @Output() savedEdits = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<DialogEditEmployeeComponent>,
    public firestoreService: FirestoreService,
    public dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.employee = data.document;
    this.fieldsToEdit = data.fieldsToEdit;
    this.birthDate = this.employee.birthDate ? new Date(this.employee.birthDate) : undefined;
  }


  emitEvent(data: any): void {
    this.savedEdits.emit(data);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async saveEdits(): Promise<void> {

    this.loading = true;

    this.employee.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;

    await this.firestoreService.updateDocument('employees', this.employee.id, this.employee.toJSON());

    setTimeout(() => {

      this.loading = false;
      this.emitEvent(this.employee)
      this.dialogRef.close();
    }, 2000);
  }
}