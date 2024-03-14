import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FirestoreService } from '../services/firestore/firestore.service';
import { User } from '../models/user.class';
import { RouterModule } from '@angular/router';
import { DateService } from '../services/date/date.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { dataForEditDialog } from '../interfaces/data-for-edit-dialog.interface';
import { CommonService } from '../services/common/common.service';
import { DialogDeleteContactComponent } from '../dialog-delete-contact/dialog-delete-contact.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, DialogAddUserComponent, MatTableModule, MatSortModule, RouterModule, MatCardModule, MatChipsModule, MatMenuModule, DialogEditUserComponent, DialogDeleteContactComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  displayedColumns: string[] = ['firstName', 'lastName', 'options'];
  dataSource: any;
  usersSubscriber: any;
  documentInFocus!: string;
  userList!: User[];

  columnSelectorButtons = {
    birthDate: false,
    email: false,
    address: false
  }

  @ViewChild(MatSort)
  sort!: MatSort;


  constructor(
    public dialog: MatDialog,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService) {

    this.usersSubscriber = this.firestoreService.contactsFrontendDistributor.subscribe((userList: User[]) => {

      this.userList = userList;
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


  openAddUserDialog(): void {
    this.dialog.open(DialogAddUserComponent, {});

  }

  openEditUserDialog(): void {

    const data: dataForEditDialog = {
      fieldsToEdit: 'all',
      user: this.commonService.getDocumentFromCollection(this.userList, this.documentInFocus, User)
    };

    this.dialog.open(DialogEditUserComponent, { data: data });
  }

  openDeleteUserDialog() {

    const data = {
      user: this.commonService.getDocumentFromCollection(this.userList, this.documentInFocus, User)
    };

    this.dialog.open(DialogDeleteContactComponent, { data: data });

  }




  toggleColumns(columnsToToggle: string[]): void {

    this.displayedColumns.pop(); //removing the 'options'...

    columnsToToggle.forEach(column => {

      const index = this.displayedColumns.indexOf(column);

      if (index === -1) this.displayedColumns.push(column);

      else this.displayedColumns.splice(index, 1);
    });

    this.displayedColumns.push('options'); //... and adding them again at the end of the array so that they are always the most right column

  }

  initializeColumnSelectorButtons(): void {

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

  setDocumentInFocus(documentId: string): void {

    this.documentInFocus = documentId;

  }






}