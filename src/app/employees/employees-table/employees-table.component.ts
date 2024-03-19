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
    private commonService: CommonService) {

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe((employeesList: Employee[]) => {

          this.employeesList = employeesList;
          this.updateTable(employeesList);
        });

    this.initializeColumnSelectorButtons();
  }


  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
  }


  updateTable(data: Employee[]): void {

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }


  initializeColumnSelectorButtons(): void {

    this.displayedColumns.forEach(column => {

      switch (column) {

        case 'birthDate': this.columnSelectorButtons.birthDate = true;
          break;

        case 'email': this.columnSelectorButtons.email = true;
          break;

        case 'phone': this.columnSelectorButtons.phone = true;
          break;

        case 'department': this.columnSelectorButtons.department = true;
          break;

        case 'position': this.columnSelectorButtons.position = true;
          break;

        case 'supervisor': this.columnSelectorButtons.supervisor = true;
          break;

        default:
          break;
      }
    });
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


  openAddEmployeeDialog(): void {
    this.dialog.open(DialogAddEmployeeComponent, {});
  }


  openEditEmployeeDialog(): void {

    this.dialog.open(DialogEditEmployeeComponent, {});
  }


  openDeleteEmployeeDialog(): void {

    const document = this.commonService.getDocumentFromCollection('employees', this.documentInFocus, Employee);

    this.dialog.open(DialogDeleteEmployeeComponent, { data: document });
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
}
