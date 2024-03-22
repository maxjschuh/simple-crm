import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CashflowChartComponent } from './cashflow-chart/cashflow-chart.component';
import { OverviewComponent } from './overview/overview.component';
import { TopRevenueEmployeeComponent } from './top-revenue-employee/top-revenue-employee.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { RouterModule } from '@angular/router';
import { DashboardDataService } from '../services/dashboard-data/dashboard-data.service';
import { AppTitleService } from '../services/app-title/app-title.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, PieChartComponent, CashflowChartComponent, OverviewComponent, TopRevenueEmployeeComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(
    public dataService: DashboardDataService,
    private titleService: AppTitleService
  ) {

    this.titleService.titleDistributor.next('Dashboard');
  }
}