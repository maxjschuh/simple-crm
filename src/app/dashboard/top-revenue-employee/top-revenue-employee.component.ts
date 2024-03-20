import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common/common.service';
import { Employee } from '../../models/employee.class';
import { DashboardDataService } from '../../services/dashboard-data/dashboard-data.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-top-revenue-employee',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './top-revenue-employee.component.html',
  styleUrl: './top-revenue-employee.component.scss'
})
export class TopRevenueEmployeeComponent implements OnInit {

  topEmployee = new Employee();
  revenue = 0;

  constructor(
    private commonService: CommonService,
    private dataService: DashboardDataService
  ) {

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

  ngOnInit(): void {



    console.log('top employee is', this.topEmployee)

  }
}
