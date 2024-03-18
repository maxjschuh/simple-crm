import { NgIf, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardDataService } from '../../services/dashboard-data/dashboard-data.service';


@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [BaseChartDirective, NgIf],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit {

  isBrowser!: boolean;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public pieChartType: ChartType = 'pie';

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['<30', '30-49', '50-69', '>70'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: [
          'rgba(123,31,162,1)',
          'rgba(123,31,162,0.7)',
          'rgba(123,31,162,0.4)',
          'rgba(123,31,162,0.1)'],
        borderColor: '#FFFFFF'
      },
    ],
  };

  constructor(
    private dataService: DashboardDataService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {

    this.pieChartData.datasets[0].data = this.dataService.returnPieChartData();
  }


  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}
