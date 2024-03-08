import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';

import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FirestoreService } from '../services/firestore.service';
import { User } from '../models/user.class';
import { RouterModule } from '@angular/router';
import { BirtDateService } from '../services/birt-date.service';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, DialogAddUserComponent, MatTableModule, MatSortModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  displayedColumns: string[] = ['firstName', 'lastName', 'birthDate', 'email', 'street', 'houseNumber', 'zipCode', 'city'];
  dataSource: any;
  usersSubscriber: any;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private firestoreService: FirestoreService,
    public birthDateService: BirtDateService
  ) {
    this.usersSubscriber = this.firestoreService.usersFrontendDistributor.subscribe((userList: User[]) => {

      this.updateTable(userList);
    });
  }

  ngOnDestroy(): void {
    this.usersSubscriber.unsubscribe();
  }

  updateTable(userData: User[]): void {

    this.dataSource = new MatTableDataSource(userData);
    this.dataSource.sort = this.sort;
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
    });

    dialogRef.afterClosed().subscribe(result => { });
  }
}