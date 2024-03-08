import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserComponent } from '../user/user.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { User } from '../models/user.class';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FirestoreService } from '../services/firestore/firestore.service';
import { NgIf } from '@angular/common';
import { BirthDateService } from '../services/birth-date/birth-date.service';
import { dataForEditDialog } from '../interfaces/data-for-edit-dialog.interface';


@Component({
  selector: 'app-dialog-edit-user',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    UserComponent,
    MatDatepickerModule,
    MatProgressBarModule,
    NgIf
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
