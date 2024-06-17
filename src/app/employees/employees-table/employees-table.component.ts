import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule, MatSortable } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { RouterModule } from '@angular/router';
import { DateService } from '../../services/date/date.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { CommonService } from '../../services/common/common.service';
import { Employee } from '../../models/employee.class';
import { DialogAddEmployeeComponent } from '../dialog-add-employee/dialog-add-employee.component';
import { DialogDeleteEmployeeComponent } from '../dialog-delete-employee/dialog-delete-employee.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MobileSort } from '../../interfaces/mobile-sort.interface';
import { NgIf } from '@angular/common';
import { DialogEditEmployeeComponent } from '../dialog-edit-employee/dialog-edit-employee.component';
import { Subscription } from 'rxjs';
import { dataForEditDialog } from '../../interfaces/data-for-edit-dialog.interface';
import { AppTitleService } from '../../services/app-title/app-title.service';


@Component({
  selector: 'app-employees-table',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    RouterModule,
    MatCardModule,
    MatChipsModule,
    MatMenuModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    NgIf
  ],
  templateUrl: './employees-table.component.html',
  styleUrl: './employees-table.component.scss'
})
export class EmployeesTableComponent {

  displayedColumns: string[] = ['firstName', 'lastName', 'position', 'email', 'options'];
  dataSource: any;
  employeesSubscriber = new Subscription;
  documentInFocus!: string;
  employeesList!: Employee[];

  columnSelectorButtons = {
    birthDate: false,
    email: false,
    phone: false,
    department: false,
    position: false,
    supervisor: false
  }

  mobileSort: MobileSort = {
    column: '',
    direction: 'asc',
    directionPicker: false,
    directionPickerIcon: 'arrow_downward'
  }

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    private commonService: CommonService,
    private titleService: AppTitleService) {

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe((employeesList: Employee[]) => {

          this.employeesList = employeesList;
          this.updateTable(employeesList);
        });

    this.titleService.titleDistributor.next('Employees');
  }


  /**
   * Unsubscribes from all subscriptions in this component.
   */
  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
  }


  /**
   * Displays the data in the table that is passed as parameter.
   * @param data array of objects of interface "Employee"
   */
  updateTable(data: Employee[]): void {

    this.dataSource = new MatTableDataSource(data);
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
   * Opens the dialog component for adding an employee.
   */
  openAddEmployeeDialog(): void {
    this.dialog.open(DialogAddEmployeeComponent, {});
  }


  /**
   * Opens the dialog for editing an employee. The "data" object is used to pass information to the dialog. Per default, the edit dialogues on the table subpages show all data fields.
   */
  openEditEmployeeDialog(): void {

    const data: dataForEditDialog = {
      fieldsToEdit: 'all',
      document: this.commonService.getDocumentFromCollection('employees', this.documentInFocus, Employee)
    };

    this.dialog.open(DialogEditEmployeeComponent, { data: data });
  }

  
  /**
   * Opens the dialog for deleting an employee. A database reference to the document is retrieved using the variable "documentInFocus", which stores the id of the document to be deleted. "documentInFocus" is updated when the user clicks on the button-menu in a table row (see setDocumentInFocus()).
   */
  openDeleteEmployeeDialog(): void {

    const document = this.commonService.getDocumentFromCollection('employees', this.documentInFocus, Employee);

    this.dialog.open(DialogDeleteEmployeeComponent, { data: document });
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