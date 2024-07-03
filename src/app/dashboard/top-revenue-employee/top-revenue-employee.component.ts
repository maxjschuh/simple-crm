import { Component } from '@angular/core';
import { Employee } from '../../models/employee.class';
import { DashboardDataService } from '../../services/dashboard-data/dashboard-data.service';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-revenue-employee',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './top-revenue-employee.component.html',
  styleUrl: './top-revenue-employee.component.scss'
})
export class TopRevenueEmployeeComponent {

  topEmployeeSubscriber = new Subscription;
  topEmployee = new Employee();
  revenue = 0;

  constructor(
    private dataService: DashboardDataService) {

    this.topEmployeeSubscriber.unsubscribe();

    this.topEmployeeSubscriber =
      this.dataService
        .topEmployeeFrontendDistributor
        .subscribe(employee => {

          this.topEmployee = employee.data;
          this.revenue = employee.revenue;
        });
  }


  /**
   * Unsubscribes from all subscriptions in this component.
   */
  ngOnDestroy(): void {

    this.topEmployeeSubscriber.unsubscribe();
  }
}