import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { DashboardDataService } from '../../services/dashboard-data/dashboard-data.service';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../services/firestore/firestore.service';

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

  transfersSubscriber = new Subscription;
  isBrowser!: boolean;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartType: ChartType = 'line';

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Monthly sales sum',
        backgroundColor: 'rgba(123,31,162,1)',
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
      legend: {
        position: 'bottom',
        display: true,
        labels: {
          color: '#fff'
        }
      }
    }
  };


  constructor(
    private dataService: DashboardDataService,
    @Inject(PLATFORM_ID) private platformId: any,
    private firestoreService: FirestoreService
  ) {

    this.transfersSubscriber.unsubscribe();

    this.transfersSubscriber =
      this.firestoreService
        .transfersFrontendDistributor
        .subscribe(() => {
          this.update();
        });
  }


  /**
   * Makes initial configurations for this component.
   */
  ngOnInit(): void {

    this.isBrowser = isPlatformBrowser(this.platformId);
  }


  /**
   * Is called when the database sends updated data. Updates the cashflow line chart.
   */
  update(): void {

    this.lineChartData.datasets[0].data = this.dataService.returnSalesLastSixMonths();

    this.lineChartData.labels = this.dataService.returnNamesLastSixMonths();

    this.chart?.chart?.update();
  }
}