import { Component, ViewChild, PLATFORM_ID, Inject, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../services/firestore/firestore.service';
import { Contact } from '../models/contact.class';
import { NgIf } from '@angular/common';
import { isPlatformBrowser } from "@angular/common";
import { DateService } from '../services/date/date.service';
import { CashflowChartComponent } from './cashflow-chart/cashflow-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective, MatCardModule, NgIf, CashflowChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  contactsSubscriber: any;
  contactsList!: Contact[];

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

    this.contactsSubscriber =
      this.firestoreService
        .contactsFrontendDistributor
        .subscribe((contactsList: Contact[]) => {

          this.contactsList = contactsList;
          this.pieChartData.datasets[0].data = this.createDataset();
        });
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnDestroy(): void {
    // this.contactsSubscriber.unsubscribe();
  }

  createDataset() {

    let ageDistribution = [0, 0, 0, 0];

    for (let i = 0; i < this.contactsList.length; i++) {
      const contact = this.contactsList[i];

      if (contact.birthDate) {

        const age = this.dateService.returnAge(contact.birthDate);

        if (age < 30) ageDistribution[0]++;

        else if (age < 50) ageDistribution[1]++;

        else if (age < 70) ageDistribution[2]++;

        else ageDistribution[3]++;
      }
    }

    return ageDistribution;
  }






}
