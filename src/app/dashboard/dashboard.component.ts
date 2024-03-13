import { Component, ViewChild, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../services/firestore/firestore.service';
import { User } from '../models/user.class';
import { NgIf } from '@angular/common';
import { isPlatformBrowser } from "@angular/common";
import { DateService } from '../services/date/date.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective, MatCardModule, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  usersSubscriber: any;
  userList!: User[];

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
    private firestoreService: FirestoreService,
    @Inject(PLATFORM_ID) private platformId: any,
    private dateService: DateService
  ) {

    this.usersSubscriber =
      this.firestoreService
        .contactsFrontendDistributor
        .subscribe((userList: User[]) => {

          this.userList = userList;
          this.pieChartData.datasets[0].data = this.createDataset();
        });
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnDestroy(): void {
    // this.usersSubscriber.unsubscribe();
  }

  createDataset() {

    let ageDistribution = [0, 0, 0, 0];

    for (let i = 0; i < this.userList.length; i++) {
      const user = this.userList[i];

      if (user.birthDate) {

        const age = this.dateService.returnAge(user.birthDate);

        if (age < 30) ageDistribution[0]++;

        else if (age < 50) ageDistribution[1]++;

        else if (age < 70) ageDistribution[2]++;

        else ageDistribution[3]++;
      }
    }

    return ageDistribution;
  }





}
