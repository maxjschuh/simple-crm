import { NgIf, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DashboardDataService } from '../../services/dashboard-data/dashboard-data.service';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [BaseChartDirective, NgIf, MatCardModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnInit {

  transfersSubscriber = new Subscription;
  isBrowser!: boolean;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public pieChartType: ChartType = 'doughnut';

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#FFFFFF'
        }
      },
    },
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Sale', 'Purchase', 'Refund'],
    datasets: [
      {
        data: [1, 1, 1],
        backgroundColor: [
          'rgba(123,31,162,1)',
          'rgba(123,31,162,0.5)',
          'rgba(123,31,162,0.2)'],
        borderColor: '#FFFFFF',
      },
    ],
  };


  constructor(
    private dataService: DashboardDataService,
    @Inject(PLATFORM_ID) private platformId: any,
    private firestoreService: FirestoreService
  ) {

    this.transfersSubscriber.unsubscribe()

    this.transfersSubscriber =
      this.firestoreService
        .transfersFrontendDistributor
        .subscribe(() => {
          this.update();
        });
  }


  ngOnInit(): void {

    this.isBrowser = isPlatformBrowser(this.platformId);
  }


  update(): void {

    this.pieChartData.datasets[0].data = this.dataService.returnPieChartData();

    this.chart?.chart?.update();
  }
}