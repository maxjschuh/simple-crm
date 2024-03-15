import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { RouterModule } from '@angular/router';
import { DateService } from '../../services/date/date.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { CommonService } from '../../services/common/common.service';
import { Employee } from '../../models/employee.class';


@Component({
  selector: 'app-employees',
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
    MatMenuModule
  ],
  templateUrl: './employees-table.component.html',
  styleUrl: './employees-table.component.scss'
})
export class EmployeesTableComponent {

  displayedColumns: string[] = ['firstName', 'lastName', 'options'];
  dataSource: any;
  employeesSubscriber: any;
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

  updateTable(data: Employee[]): void {

    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
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

  openEditEmployeeDialog() {


  }

  openAddEmployeeDialog() {


  }

  openDeleteEmployeeDialog() {

  }
}
