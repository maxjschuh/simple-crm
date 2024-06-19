import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule, MatSortable } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Contact } from '../../models/contact.class';
import { RouterModule } from '@angular/router';
import { DateService } from '../../services/date/date.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { dataForEditDialog } from '../../interfaces/data-for-edit-dialog.interface';
import { CommonService } from '../../services/common/common.service';
import { DialogDeleteContactComponent } from '../dialog-delete-contact/dialog-delete-contact.component';
import { DialogAddContactComponent } from '../dialog-add-contact/dialog-add-contact.component';
import { DialogEditContactComponent } from '../dialog-edit-contact/dialog-edit-contact.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MobileSort } from '../../interfaces/mobile-sort.interface';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { AppTitleService } from '../../services/app-title/app-title.service';

@Component({
  selector: 'app-contacts-table',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule, DialogAddContactComponent, MatTableModule, MatSortModule, RouterModule, MatCardModule, MatChipsModule, MatMenuModule, DialogEditContactComponent, DialogDeleteContactComponent, MatSelectModule, MatFormFieldModule, NgIf],
  templateUrl: './contacts-table.component.html',
  styleUrl: './contacts-table.component.scss'
})
export class ContactsTableComponent implements AfterViewInit {

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'options'];
  dataSource: any;
  contactsSubscriber = new Subscription;
  documentInFocus!: string;
  contactsList!: Contact[];

  columnSelectorButtons = {
    birthDate: false,
    email: true,
    phone: false,
    address: false
  }

  mobileSort: MobileSort = {
    column: '',
    direction: 'asc',
    directionPicker: false,
    directionPickerIcon: 'arrow_downward'
  }

  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    public dialog: MatDialog,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService,
    private titleService: AppTitleService) {

    this.contactsSubscriber =
      this.firestoreService
        .contactsFrontendDistributor
        .subscribe((contactsList: Contact[]) => {

          this.contactsList = contactsList;
          this.updateTable(contactsList);
        });

    this.titleService.titleDistributor.next('Contacts');
  }

  
  /**
   * Initializes the data source object (used in the sorted table).
   */
  ngAfterViewInit(): void {

    this.updateTable(this.contactsList);
  }


  /**
   * Unsubscribes from all subscriptions in this component.
   */
  ngOnDestroy(): void {
    this.contactsSubscriber.unsubscribe();
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


  /**
   * Displays the data in the table that is passed as parameter.
   * @param data array of objects of interface "Contact"
   */
  updateTable(data: Contact[]): void {

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }


  /**
   * Opens the dialog component for adding a contact.
   */
  openAddContactDialog(): void {

    this.dialog.open(DialogAddContactComponent, {});
  }


  /**
   * Opens the dialog for editing a contact. The "data" object is used to pass information to the dialog. Per default, the edit dialogues on the table subpages show all data fields.
   */
  openEditContactDialog(): void {

    const data: dataForEditDialog = {
      fieldsToEdit: 'all',
      document: this.commonService.getDocumentFromCollection('contacts', this.documentInFocus, Contact)
    };

    this.dialog.open(DialogEditContactComponent, { data: data });
  }


  /**
   * Opens the dialog component for deleting a contact. A database reference to the document is retrieved using the variable "documentInFocus", which stores the id of the document to be deleted. "documentInFocus" is updated when the user clicks on the button-menu in a table row (see setDocumentInFocus()).
   */
  openDeleteContactDialog(): void {

    const document = this.commonService.getDocumentFromCollection('contacts', this.documentInFocus, Contact);

    this.dialog.open(DialogDeleteContactComponent, { data: document });
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
}