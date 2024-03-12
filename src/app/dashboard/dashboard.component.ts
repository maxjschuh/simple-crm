import { Component, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    ],
  };

}
