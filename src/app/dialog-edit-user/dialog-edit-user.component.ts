import { BirthDateService } from '../services/birth-date/birth-date.service';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
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

  @Output() savedEdits = new EventEmitter<any>();

  // Function to emit the event
  emitEvent(data: any) {
    this.savedEdits.emit(data);
  }

  constructor(
    public dialogRef: MatDialogRef<DialogEditUserComponent>,
    public firestoreService: FirestoreService,
    public birthDateService: BirthDateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
    this.fieldsToEdit = data.fieldsToEdit;
    this.birthDate = this.user.birthDate ? new Date(this.user.birthDate) : undefined;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  async saveEdits(): Promise<void> {

    this.loading = true;
    
    this.user.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;

    await this.firestoreService.updateDocument('users', this.user.id, this.user.toJSON());

    setTimeout(() => {

      this.loading = false;
      this.emitEvent(this.user)
      this.dialogRef.close();
    }, 2000);

  }
}
