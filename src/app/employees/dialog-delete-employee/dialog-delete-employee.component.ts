import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogDeleteContactComponent } from '../../contacts/dialog-delete-contact/dialog-delete-contact.component';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Employee } from '../../models/employee.class';

@Component({
  selector: 'app-dialog-delete-employee',
  standalone: true,
  imports: [MatDialogContent, MatCheckboxModule, MatDialogActions, MatDialogClose, MatProgressBarModule, MatButtonModule, MatDialogTitle, NgIf, FormsModule, MatTooltipModule],
  templateUrl: './dialog-delete-employee.component.html',
  styleUrl: './dialog-delete-employee.component.scss'
})
export class DialogDeleteEmployeeComponent {

  loading = false;
  deletionConfirmed = false;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteContactComponent>,
    public firestoreService: FirestoreService,
    @Inject(MAT_DIALOG_DATA) public employee: Employee
  ) { }


  onNoClick(): void {
    this.dialogRef.close();
  }


  async deleteEmployee(): Promise<void> {

    this.loading = true;
    await this.firestoreService.deleteDocument('employees', this.employee.id);

    setTimeout(() => {

      this.loading = false;
      this.deletionConfirmed = false;
      this.dialogRef.close();
    }, 1000);
  }
}