import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, DialogAddUserComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  firstName: string = '';
  lastName: string = '';
  birthDate: string = '';
  street: string = '';
  houseNumber: string = '';
  zipCode: number | '' = '';
  city: string = '';


  constructor(
    public dialog: MatDialog,
    public firestoreService: FirestoreService
  ) { }

  
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      data: {
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: this.birthDate,
        street: this.street,
        houseNumber: this.houseNumber,
        zipCode: this.zipCode,
        city: this.city
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}