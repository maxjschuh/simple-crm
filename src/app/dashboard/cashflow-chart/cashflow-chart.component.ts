import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { DashboardDataService } from '../../services/dashboard-data/dashboard-data.service';

@Component({
  selector: 'app-cashflow-chart',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatCardModule,
    NgIf
  ],
  templateUrl: './cashflow-chart.component.html',
  styleUrl: './cashflow-chart.component.scss'
})
export class CashflowChartComponent implements OnInit {

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Cashflow',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(123,31,162,1)',
        pointBackgroundColor: 'rgba(123,31,162,1)',
        pointBorderColor: 'rgba(123,31,162,1)',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'rgba(123,31,162,1)',
      }
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: {
      line: {
        tension: 0.5,
      }
    },
    scales: { // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
        ticks: {
          color: '#fff',
        }
      },
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255,255,255,0.2)',
        }
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,255,255,0.2)',
        },
        ticks: {
          color: 'rgb(66,66,66)',
        }
      }
    },
    plugins: {
      legend: { display: true }
    }
  };

  isBrowser!: boolean;


  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;


  constructor(
    private firestoreService: FirestoreService,
    private dataService: DashboardDataService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {

    this.lineChartData.datasets[0].data = this.dataService.returnDepositLastSixMonths();

    this.lineChartData.labels = this.dataService.returnNamesLastSixMonths();
  }


  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}


