import { BirthDateService } from '../services/birth-date/birth-date.service';
import { Component, Inject } from '@angular/core';
import { dataForEditDialog } from '../interfaces/data-for-edit-dialog.interface';
import { FirestoreService } from '../services/firestore/firestore.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { User } from '../models/user.class';
import { UserComponent } from '../user/user.component';


@Component({
  selector: 'app-dialog-edit-user',
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
    UserComponent
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-edit-user.component.html',
  styleUrl: './dialog-edit-user.component.scss'
})
export class DialogEditUserComponent {

  user: User;
  birthDate: Date | undefined = undefined;
  loading = false;
  fieldsToEdit: string;

  constructor(
    public dialogRef: MatDialogRef<DialogEditUserComponent>,
    private firestoreService: FirestoreService,
    public birthDateService: BirthDateService,
    @Inject(MAT_DIALOG_DATA) public data: dataForEditDialog
  ) {
    this.user = data.user;
    this.fieldsToEdit = data.fieldsToEdit;
    this.birthDate = this.user.birthDate ? new Date(this.user.birthDate) : undefined;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  async saveUser(): Promise<void> {

    this.loading = true;
    this.user.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;

    const response = await this.firestoreService.addDocument('users', this.user.toJSON());

    setTimeout(() => {

      this.loading = false;
      this.dialogRef.close();
    }, 2000);
  }
}
