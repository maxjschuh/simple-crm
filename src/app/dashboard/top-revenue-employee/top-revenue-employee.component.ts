import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { CommonService } from '../../services/common/common.service';
import { Employee } from '../../models/employee.class';
import { DashboardDataService } from '../../services/dashboard-data/dashboard-data.service';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
  selector: 'app-top-revenue-employee',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './top-revenue-employee.component.html',
  styleUrl: './top-revenue-employee.component.scss'
})
export class TopRevenueEmployeeComponent implements AfterViewInit {

  transfersSubscriber = new Subscription;
  topEmployee = new Employee();
  revenue = 0;

  employeeSubscriber = new Subscription;

  constructor(
    private commonService: CommonService,
    private dataService: DashboardDataService,
    private firestoreService: FirestoreService,
    private cd: ChangeDetectorRef
  ) { }


  /**
   * Makes initial configurations for this component.
   */
  ngAfterViewInit(): void {

    this.transfersSubscriber.unsubscribe();

    this.transfersSubscriber =
      this.firestoreService
        .transfersFrontendDistributor
        .subscribe(() => {
          this.update();
          this.cd.detectChanges();
        });

    setTimeout(() => {
      this.update()
      this.cd.detectChanges();
    }, 200);
  }


  /**
   * Is called when the database sends updated data. Updates the top employee box.
   */
  update(): void {

    const topEmployee: { employeeId: string, revenue: number } =
      this.dataService
        .returnTopEmployee();

    this.revenue = topEmployee.revenue;

    this.topEmployee =
      this.commonService.getDocumentFromCollection(
        'employees',
        topEmployee.employeeId,
        Employee);
  }
}