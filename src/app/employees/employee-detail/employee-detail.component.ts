import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { dataForEditDialog } from '../../interfaces/data-for-edit-dialog.interface';
import { CommonService } from '../../services/common/common.service';
import { DateService } from '../../services/date/date.service';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Employee } from '../../models/employee.class';
import { DialogEditEmployeeComponent } from '../dialog-edit-employee/dialog-edit-employee.component';
import { Transfer } from '../../models/transfer.class';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { AppTitleService } from '../../services/app-title/app-title.service';
import { DialogDeleteEmployeeComponent } from '../dialog-delete-employee/dialog-delete-employee.component';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule, RouterModule, MatAccordion, MatExpansionModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {

  private routeSubscriber = new Subscription;
  employeesSubscriber = new Subscription;
  employee = new Employee();
  employeeId = '';
  linkToSupervisor: string[] = [];
  closings: Transfer[] = [];

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    public dialog: MatDialog,
    public commonService: CommonService,
    private titleService: AppTitleService) {
  }


  /**
   * Extracts the id of the employee to display from the current url params and calls the init() function.
   */
  ngOnInit(): void {

    this.routeSubscriber.unsubscribe();

    this.routeSubscriber = this.route.params.subscribe(params => {

      this.employeeId = params['id'];
      this.init();
    });
  }


  /**
   * Creates subscriptions to the datasets and sets the title in the header menu as "Employee-Details". When a subscription receives an update, the data in the component is updated.
   */
  init(): void {

    this.employeesSubscriber.unsubscribe();

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe(() => {

          this.employee =
            this.commonService
              .getDocumentFromCollection('employees', this.employeeId, Employee);

          this.linkToSupervisor = this.commonService.returnLinkToPerson('/employees', this.employee.supervisorId);
          this.closings = this.commonService.returnClosingsOfEmployee(this.employeeId);

          this.titleService.titleDistributor.next('Employee-Details');
        });
  }


  /**
   * Unsubscribes from all subscriptions in this component.
   */
  ngOnDestroy(): void {

    this.routeSubscriber.unsubscribe();
    this.employeesSubscriber.unsubscribe();
  }


  /**
   * Opens the dialog for editing an employee. The "data" object is used to pass information to the dialog.
   * @param {string} fieldsToEdit data fields that should be shown in the edit dialog
   */
  openEditEmployeeDialog(fieldsToEdit: 'name+email+phone' | 'position+department' | 'birthDate+supervisor' | 'all'): void {

    const data: dataForEditDialog = {
      fieldsToEdit: fieldsToEdit,
      document: new Employee(this.employee)
    };

    this.dialog.open(DialogEditEmployeeComponent, { data: data });
  }


  /**
   * Opens the dialog for deleting an employee.
   */
  openDeleteEmployeeDialog(): void {

    this.dialog.open(DialogDeleteEmployeeComponent, { data: this.employee });
  }
}