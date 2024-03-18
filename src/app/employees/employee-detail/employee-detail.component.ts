import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogDeleteContactComponent } from '../../contacts/dialog-delete-contact/dialog-delete-contact.component';
import { dataForEditDialog } from '../../interfaces/data-for-edit-dialog.interface';
import { CommonService } from '../../services/common/common.service';
import { DateService } from '../../services/date/date.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Employee } from '../../models/employee.class';
import { DialogEditEmployeeComponent } from '../dialog-edit-employee/dialog-edit-employee.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule, RouterModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {
  
  private routeSubscriber = new Subscription;
  employeesSubscriber: any;
  editsSubscriber: any;
  employee = new Employee();
  employeeId = '';

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    public dialog: MatDialog,
    private commonService: CommonService) { }

  ngOnInit(): void {

    this.routeSubscriber = this.route.params.subscribe(params => {
      this.employeeId = params['id'];
    });

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe((employeesList: Employee[]) => {

          this.employee = this.commonService.getDocumentFromCollection('employees', this.employeeId, Employee);
        });
  }


  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe();
    this.employeesSubscriber.unsubscribe();
    // this.editsSubscriber.unsubscribe();

  }

  openEditDialog(fieldsToEdit: 'name+email+phone' | 'position+department' | 'birthDate+supervisor' | 'all'): void {

    const data: dataForEditDialog = {
      fieldsToEdit: fieldsToEdit,
      document: new Employee(this.employee)
    };


    const dialogRef = this.dialog.open(DialogEditEmployeeComponent, { data: data });

    this.editsSubscriber = dialogRef.componentInstance.savedEdits.subscribe((eventData: any) => {
      this.employee = new Employee(eventData)
    });

  }

  openDeleteEmployeeDialog() {

    const data = {
      contact: this.employee
    };

    this.dialog.open(DialogDeleteContactComponent, { data: data });

  }
}
