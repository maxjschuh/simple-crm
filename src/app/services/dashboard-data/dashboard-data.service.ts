import { Injectable } from '@angular/core';
import { Employee } from '../../models/employee.class';
import { Transfer } from '../../models/transfer.class';
import { FirestoreService } from '../firestore/firestore.service';
import { Subscription } from 'rxjs';
import { Contact } from '../../models/contact.class';
import { DateService } from '../date/date.service';


@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  employeesSubscriber = new Subscription;
  employees: Employee[] = [];

  transfersSubscriber = new Subscription;
  transfers: Transfer[] = [];

  contactsSubscriber = new Subscription; //not yet in use
  contacts: Contact[] = [];

  transfersByLastSixMonths: any[] = [];

  topDealer = { employeeId: '', revenue: 0 };


  constructor(
    private firestoreService: FirestoreService,
    private dateService: DateService) {

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe(employees => {
          this.employees = employees;
        });

    this.transfersSubscriber =
      this.firestoreService
        .transfersFrontendDistributor
        .subscribe(transfers => {
          this.transfers = transfers;
        });

    this.contactsSubscriber =
      this.firestoreService
        .contactsFrontendDistributor
        .subscribe(contacts => {
          this.contacts = contacts;
        });

    this.transfersByLastSixMonths = this.returnTransfersLastSixMonths();
  }


  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
    this.transfersSubscriber.unsubscribe();
    this.contactsSubscriber.unsubscribe();
  }


  //Last six months sales data

  returnTransfersLastSixMonths(): Transfer[][] {
    const today = new Date();
    let transfersLastSixMonths = [];

    for (let i = 5; i >= 0; i--) {

      const startOfMonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

      const objectsInMonth = this.transfers.filter(obj => {

        const objDate = new Date(obj.date); // Convert milliseconds to Date object
        return objDate >= startOfMonth && objDate <= endOfMonth;
      });

      transfersLastSixMonths.push(objectsInMonth);
    }

    return transfersLastSixMonths;
  }



  //Cashflow-Graph
  returnDepositLastSixMonths() {

    this.transfersByLastSixMonths = this.returnTransfersLastSixMonths();

    let depositCurrently = 0;

    let depositMonthly: number[] = [];

    for (let i = 0; i < this.transfersByLastSixMonths.length; i++) {
      const transfersMonthly = this.transfersByLastSixMonths[i];

      for (let j = 0; j < transfersMonthly.length; j++) {
        const transfer = transfersMonthly[j];

        depositCurrently = depositCurrently + transfer.amount;
      }

      depositMonthly.push(depositCurrently);
    }

    return depositMonthly;
  }


  returnNamesLastSixMonths(): string[] {
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

    return months;
  }



  //top employee

  returnTopEmployee() {

    let revenuesByEmployee: { employeeId: string, revenue: number }[] = [];

    for (let i = 0; i < this.employees.length; i++) {
      const employee = this.employees[i];

      revenuesByEmployee.push(
        this.computeTotalRevenueOfEmployee(employee, this.transfersByLastSixMonths)
      );
    }

    return this.returnEmployeeWithHighestRevenue(revenuesByEmployee);
  }


  computeTotalRevenueOfEmployee(
    employee: Employee,
    transfersByLastSixMonths: Transfer[][]): { employeeId: string, revenue: number } {

    let revenue = 0;

    for (let i = 0; i < transfersByLastSixMonths.length; i++) {
      const transfersMonthly = transfersByLastSixMonths[i];

      for (let j = 0; j < transfersMonthly.length; j++) {
        const transfer = transfersMonthly[j];

        if (transfer.closedyById === employee.id && transfer.amount > 0) {

          revenue = revenue + transfer.amount;
        }
      }
    }

    return { employeeId: employee.id, revenue: revenue };
  }


  returnEmployeeWithHighestRevenue(
    revenuesByEmployee: { employeeId: string, revenue: number }[]): { employeeId: string, revenue: number } {

    let topDealer = { employeeId: '', revenue: 0 };

    for (let i = 0; i < revenuesByEmployee.length; i++) {
      const revenueEmployee = revenuesByEmployee[i];

      if (revenueEmployee.revenue > topDealer.revenue) {

        topDealer = { employeeId: revenueEmployee.employeeId, revenue: revenueEmployee.revenue };
      }
    }

    return topDealer;
  }


  //pie chart
  returnPieChartData(): number[] {

    let ageDistribution = [0, 0, 0, 0];

    for (let i = 0; i < this.contacts.length; i++) {
      const contact = this.contacts[i];

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
