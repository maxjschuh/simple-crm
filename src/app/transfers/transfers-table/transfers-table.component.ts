import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddContactComponent } from '../../contacts/dialog-add-contact/dialog-add-contact.component';
import { MatSort, MatSortModule, MatSortable } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { RouterModule } from '@angular/router';
import { DateService } from '../../services/date/date.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { DialogEditContactComponent } from '../../contacts/dialog-edit-contact/dialog-edit-contact.component';
import { CommonService } from '../../services/common/common.service';
import { DialogDeleteContactComponent } from '../../contacts/dialog-delete-contact/dialog-delete-contact.component';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/select';
import { Transfer } from '../../models/transfer.class';
import { DialogAddTransferComponent } from '../dialog-add-transfer/dialog-add-transfer.component';
import { MobileSort } from '../../interfaces/mobile-sort.interface';
import { NgIf } from '@angular/common';
import { dataForEditDialog } from '../../interfaces/data-for-edit-dialog.interface';
import { DialogEditTransferComponent } from '../dialog-edit-transfer/dialog-edit-transfer.component';
import { DialogDeleteTransferComponent } from '../dialog-delete-transfer/dialog-delete-transfer.component';
import { Subscription } from 'rxjs';
import { AppTitleService } from '../../services/app-title/app-title.service';

@Component({
  selector: 'app-transfers-table',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, DialogAddContactComponent, MatTableModule, MatSortModule, RouterModule, MatCardModule, MatChipsModule, MatMenuModule, DialogEditContactComponent, DialogDeleteContactComponent, MatFormField, MatLabel, MatSelect, MatOption, NgIf],
  templateUrl: './transfers-table.component.html',
  styleUrl: './transfers-table.component.scss'
})
export class TransfersTableComponent implements AfterViewInit {

  displayedColumns: string[] = ['title', 'date', 'closedBy', 'options'];
  dataSource: any;
  transfersSubscriber = new Subscription;
  documentInFocus!: string;
  transfersList!: Transfer[];

  columnSelectorButtons = {
    date: true,
    closedBy: true,
    amount: false,
    type: false,
    payer: false,
    recipient: false
  };

  mobileSort: MobileSort = {
    column: '',
    direction: 'asc',
    directionPicker: false,
    directionPickerIcon: 'arrow_downward'
  };

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService,
    private titleService: AppTitleService) {

    this.transfersSubscriber =
      this.firestoreService
        .transfersFrontendDistributor
        .subscribe((transfersList: Transfer[]) => {

          this.transfersList = transfersList;
          this.updateTable(transfersList);
        });

    this.titleService.titleDistributor.next('Transactions');
  }


  /**
   * Initializes the data source object (used in the sorted table).
   */
  ngAfterViewInit(): void {

    this.updateTable(this.transfersList);
  }

  
  /**
   * Unsubscribes from all subscriptions in this component.
   */
  ngOnDestroy(): void {
    this.transfersSubscriber.unsubscribe();
  }


  /**
   * Displays the data in the table that is passed as parameter.
   * @param transfersList array of objects of interface "Transfer" (called "Transaction" in UI)
   */
  updateTable(transfersList: Transfer[]): void {

    this.dataSource = new MatTableDataSource(transfersList);
    this.dataSource.sort = this.sort;
  }


  /**
   * Shows or hides columns in the table, according to the bread crumb buttons that the user can select above the table.
   * @param columnsToToggle array of column names that should be shown
   */
  toggleColumns(columnsToToggle: string[]): void {

    this.displayedColumns.pop(); //removing the 'options'...

    columnsToToggle.forEach(column => {

      const index = this.displayedColumns.indexOf(column);

      if (index === -1) this.displayedColumns.push(column);

      else this.displayedColumns.splice(index, 1);
    });

    this.displayedColumns.push('options'); //... and adding them again at the end of the array so that they are always the most right column
  }


  /**
   * Is called when the user clicks on the three-dot-menu that is shown in every column row. Sets the document in focus, so that the edit- or delete-dialogs that can be selected afterwards, show the correct document.
   * @param documentId string containing the document id (used in firestore)
   */
  setDocumentInFocus(documentId: string): void {

    this.documentInFocus = documentId;
  }


  /**
   * Opens the dialog component for adding a transfer (called "transaction" in the UI).
   */
  openAddTransferDialog(): void {

    this.dialog.open(DialogAddTransferComponent, {})
  }


  /**
   * Opens the dialog for editing a transfer (called "transaction" in the UI). The "data" object is used to pass information to the dialog. Per default, the edit dialogues on the table subpages show all data fields.
   */
  openEditTransferDialog(): void {

    const data: dataForEditDialog = {
      fieldsToEdit: 'all',
      document: this.commonService.getDocumentFromCollection('transfers', this.documentInFocus, Transfer)
    };

    this.dialog.open(DialogEditTransferComponent, { data: data });
  }


  /**
   * Opens the dialog for deleting a transfer (called "transaction" in the UI). A database reference to the document is retrieved using the variable "documentInFocus", which stores the id of the document to be deleted. "documentInFocus" is updated when the user clicks on the button-menu in a table row (see setDocumentInFocus()).
   */
  openDeleteTransferDialog(): void {

    const document = this.commonService.getDocumentFromCollection('transfers', this.documentInFocus, Transfer);

    this.dialog.open(DialogDeleteTransferComponent, { data: document });
  }


  /**
   * Changes the sort direction of the table from ascending to descending and vice versa.
   */
  changeSortDirectionMobile(): void {

    if (this.mobileSort.direction === 'asc') {

      this.mobileSort.direction = 'desc';
      this.mobileSort.directionPickerIcon = 'arrow_upward';

    } else {

      this.mobileSort.direction = 'asc'
      this.mobileSort.directionPickerIcon = 'arrow_downward';
    }

    this.sortTableMobile(undefined);
  }


  /**
   * Sorts the table by the column that is passed as parameter.
   * @param sortByColumn column name to sort by
   */
  sortTableMobile(sortByColumn: string | undefined): void {

    this.mobileSort.directionPicker = true;

    if (sortByColumn) this.mobileSort.column = sortByColumn;

    this.sort.sort(({ id: this.mobileSort.column, start: this.mobileSort.direction }) as MatSortable);
    this.dataSource.sort = this.sort;
  }
}