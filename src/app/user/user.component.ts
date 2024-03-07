import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, DialogAddUserComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  

  constructor(
    public dialog: MatDialog
  ) { }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

}