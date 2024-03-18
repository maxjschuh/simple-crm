import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CashflowChartComponent } from './cashflow-chart/cashflow-chart.component';
import { OverviewComponent } from './overview/overview.component';
import { TopRevenueEmployeeComponent } from './top-revenue-employee/top-revenue-employee.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, PieChartComponent, CashflowChartComponent, OverviewComponent, TopRevenueEmployeeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


}