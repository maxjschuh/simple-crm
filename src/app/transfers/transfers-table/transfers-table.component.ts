import { Component, ViewChild } from '@angular/core';
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
export class TransfersTableComponent {

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

  @ViewChild(MatSort)
  sort!: MatSort;

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


  ngOnDestroy(): void {
    this.transfersSubscriber.unsubscribe();
  }


  updateTable(transfersList: Transfer[]): void {

    this.dataSource = new MatTableDataSource(transfersList);
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


  openAddTransferDialog(): void {

    this.dialog.open(DialogAddTransferComponent, {})
  }


  openEditTransferDialog(): void {

    const data: dataForEditDialog = {
      fieldsToEdit: 'all',
      document: this.commonService.getDocumentFromCollection('transfers', this.documentInFocus, Transfer)
    };

    this.dialog.open(DialogEditTransferComponent, { data: data });
  }


  openDeleteTransferDialog(): void {

    const document = this.commonService.getDocumentFromCollection('transfers', this.documentInFocus, Transfer);

    this.dialog.open(DialogDeleteTransferComponent, { data: document });
  }


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


  sortTableMobile(sortByColumn: string | undefined): void {

    this.mobileSort.directionPicker = true;

    if (sortByColumn) this.mobileSort.column = sortByColumn;

    this.sort.sort(({ id: this.mobileSort.column, start: this.mobileSort.direction }) as MatSortable);
    this.dataSource.sort = this.sort;
  }


  initializeColumnSelectorButtons(): void {

    this.displayedColumns.forEach(column => {

      switch (column) {

        case 'date': this.columnSelectorButtons.date = true;
          break;

        case 'closedBy': this.columnSelectorButtons.closedBy = true;
          break;

        case 'amount': this.columnSelectorButtons.amount = true;
          break;

        case 'type': this.columnSelectorButtons.type = true;
          break;

        case 'payer': this.columnSelectorButtons.payer = true;
          break;

        case 'recipient': this.columnSelectorButtons.recipient = true;
          break;

        default:
          break;
      }
    });
  }
}
