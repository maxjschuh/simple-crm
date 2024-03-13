import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FirestoreService } from '../services/firestore/firestore.service';
import { RouterModule } from '@angular/router';
import { DateService } from '../services/date/date.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { CommonService } from '../services/common/common.service';
import { DialogDeleteContactComponent } from '../dialog-delete-contact/dialog-delete-contact.component';


import { Transaction } from '@angular/fire/firestore';
import { DialogAddTransactionComponent } from '../dialog-add-transaction/dialog-add-transaction.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, DialogAddUserComponent, MatTableModule, MatSortModule, RouterModule, MatCardModule, MatChipsModule, MatMenuModule, DialogEditUserComponent, DialogDeleteContactComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {

  displayedColumns: string[] = ['title', 'date'];
  dataSource: any;
  transactionsSubscriber: any;
  documentInFocus!: string;
  transactionsList!: Transaction[];

  columnSelectorButtons = {
    date: false,
    closedBy: false,
    amount: false,
    type: false,
    payer: false,
    recipient: false
  }

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService) {

    this.transactionsSubscriber =
      this.firestoreService
        .transactionsFrontendDistributor
        .subscribe((transactionsList: Transaction[]) => {

          this.transactionsList = transactionsList;
          this.updateTable(transactionsList);
        });
  }

  ngOnDestroy(): void {
    this.transactionsSubscriber.unsubscribe();
  }

  updateTable(transactionsList: Transaction[]): void {

    this.dataSource = new MatTableDataSource(transactionsList);
    this.dataSource.sort = this.sort;
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


  setDocumentInFocus(documentId: string): void {

    this.documentInFocus = documentId;

  }


  openAddTransactionDialog() {
    this.dialog.open(DialogAddTransactionComponent, {})
  }

  openEditTransactionDialog() {


  }

  openDeleteTransactionDialog() {

  }
}
