import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';

import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FirestoreService } from '../services/firestore/firestore.service';
import { User } from '../models/user.class';
import { RouterModule } from '@angular/router';
import { BirthDateService } from '../services/birth-date/birth-date.service';
import { MatRippleModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';


export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, DialogAddUserComponent, MatTableModule, MatSortModule, RouterModule, MatRippleModule, MatCardModule, MatChipsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  displayedColumns: string[] = ['firstName', 'lastName', 'birthDate'];
  dataSource: any;
  usersSubscriber: any;

  @ViewChild(MatSort)
  sort!: MatSort;

  columnSelectorButtons = {
    birthDate: false,
    email: false,
    address: false
  }

  desserts: Dessert[] = [
    { name: 'Frozen yogurt', calories: 159, fat: 6, carbs: 24, protein: 4 },
    { name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4 },
    { name: 'Eclair', calories: 262, fat: 16, carbs: 24, protein: 6 },
    { name: 'Cupcake', calories: 305, fat: 4, carbs: 67, protein: 4 },
    { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 4 },
  ];

  constructor(
    public dialog: MatDialog,
    private firestoreService: FirestoreService,
    public birthDateService: BirthDateService
  ) {
    this.usersSubscriber = this.firestoreService.usersFrontendDistributor.subscribe((userList: User[]) => {

      this.updateTable(userList);
    });

    this.initializeColumnSelectorButtons();

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

  toggleColumns(columnsToToggle: string[]) {

    columnsToToggle.forEach(column => {

      const index = this.displayedColumns.indexOf(column);

      if (index === -1) this.displayedColumns.push(column);

      else this.displayedColumns.splice(index, 1);
    });
  }

  initializeColumnSelectorButtons() {

    this.displayedColumns.forEach(column => {

      switch (column) {

        case 'birthDate':
          this.columnSelectorButtons.birthDate = true;
          break;

        case 'email':
          this.columnSelectorButtons.email = true;
          break;

        case 'street':
          this.columnSelectorButtons.address = true;
          break;

        default:
          break;
      }
    });

  }





}