import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { Subscription } from 'rxjs';
import { Transfer } from '../../models/transfer.class';
import { isPlatformBrowser } from '@angular/common';
import { Employee } from '../../models/employee.class';

@Component({
  selector: 'app-cashflow-chart',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatCardModule
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
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
    },

    plugins: {
      legend: { display: true }
    },
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  transfersSubscriber: Subscription;
  transfersList: Transfer[] = [];

  employeesSubscriber: Subscription;
  employeesList: Employee[] = [];

  transfersByLastSixMonths: any[] = [];
  isBrowser!: boolean;

  topDealer = {id: '', revenue: 0};

  constructor(
    private firestoreService: FirestoreService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.transfersSubscriber =
      this.firestoreService
        .transfersFrontendDistributor
        .subscribe(transfersList => {

          this.transfersList = transfersList;
        });

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe(employeesList => {

          this.employeesList = employeesList;
        });


    this.generateArraysForLastSixMonths();
    this.aggregateData();
    console.log(this.transfersByLastSixMonths);

    this.lineChartData.labels = this.getLastSixMonths();
  }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.findTopDealer();
  }

  ngOnDestroy(): void {
    // this.transfersSubscriber.unsubscribe();
    this.employeesSubscriber.unsubscribe();
  }

  aggregateData() {

    let depositCurrently = 0;

    let depositMonthly: number[] = [];

    for (let i = 0; i < this.transfersByLastSixMonths.length; i++) {
      const transfersMonthly = this.transfersByLastSixMonths[i];

      for (let j = 0; j < transfersMonthly.length; j++) {
        const transfer = transfersMonthly[j];

        depositCurrently = depositCurrently + transfer.amount;
      }
      console.log(depositCurrently)
      depositMonthly.push(depositCurrently);
    }
    console.log(depositMonthly)
    this.lineChartData.datasets[0].data = depositMonthly;
  }

  // dataArray: any[] = [
  //   { id: 1, date: new Date('2024-03-01').getTime() }, // March 2024
  //   { id: 2, date: new Date('2024-02-15').getTime() }, // February 2024
  //   { id: 3, date: new Date('2024-01-05').getTime() }, // January 2024
  //   { id: 4, date: new Date('2023-12-20').getTime() }, // December 2023
  //   { id: 1, date: new Date('2024-03-01').getTime() }, // March 2024
  //   { id: 2, date: new Date('2024-02-15').getTime() }, // February 2024
  //   { id: 3, date: new Date('2024-01-05').getTime() }, // January 2024
  //   { id: 4, date: new Date('2023-12-20').getTime() }, // December 2023
  //   { id: 2, date: new Date('2024-02-15').getTime() }, // February 2024
  //   { id: 3, date: new Date('2024-01-05').getTime() }, // January 2024
  //   { id: 4, date: new Date('2023-12-20').getTime() }, // December 2023
  //   // Add more sample objects as needed
  // ];


  generateArraysForLastSixMonths(): void {
    const today = new Date();
    let dataArray = this.transfersList;
    this.transfersByLastSixMonths = [];

    for (let i = 5; i >= 0; i--) {

      const startOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      const objectsInMonth = dataArray.filter(obj => {

        const objDate = new Date(obj.date); // Convert milliseconds to Date object
        return objDate >= startOfMonth && objDate <= endOfMonth;
      });

      this.transfersByLastSixMonths.push(objectsInMonth);
    }
  }

  getLastSixMonths(): string[] {
    const months: string[] = [];
    const currentDate: Date = new Date();
    const monthNames: string[] = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentDate.getMonth() - i + 12) % 12; // Ensure month index is in range [0, 11]
      months.push(monthNames[monthIndex]);
    }

    console.log(months)
    return months;
  }





  findTopDealer() {

    let revenuesByEmployee: {id: string, revenue: number}[] = [];

    for (let i = 0; i < this.employeesList.length; i++) {
      const employee = this.employeesList[i];

      revenuesByEmployee.push(this.computeTotalRevenueForEmployee(employee));
    }

    for (let j = 0; j < revenuesByEmployee.length; j++) {
      const revenueEmployee = revenuesByEmployee[j];

      if (revenueEmployee.revenue > this.topDealer.revenue) {
        
        this.topDealer = {id: revenueEmployee.id, revenue: revenueEmployee.revenue};
      }
    }
  }



  computeTotalRevenueForEmployee(employee: Employee): {id: string, revenue: number} {

    let revenue = 0;
  
    for (let j = 0; j < this.transfersByLastSixMonths.length; j++) {
      const transfer = this.transfersByLastSixMonths[j];
  
      if (transfer.closedyById === employee.id && transfer.amount > 0) {
       
        revenue = revenue + transfer.amount;
      }
    }

    return {id: employee.id, revenue: revenue};
  }



  
}


