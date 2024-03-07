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


export interface DialogData {
  firstName: string,
  lastName: string,
  birthDate: string,
  street: string,
  houseNumber: string,
  zipCode: number | '',
  city: string
}


@Component({
  selector: 'app-dialog-add-user',
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
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent {

  user = new User();
  birthDate: Date | undefined = undefined;

  constructor(
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}


  onNoClick(): void {
    this.dialogRef.close();
  }


  saveUser() {
    this.user.birthDate = this.birthDate ? this.birthDate.getTime() : undefined;
    console.log(this.user);

    // this.firestore
    //   .collection('users')
    //   .add(this.user)
    //   .then((result: any) => {
    //     console.log('upload to firestore finished', result);
    //   });

  }

}
