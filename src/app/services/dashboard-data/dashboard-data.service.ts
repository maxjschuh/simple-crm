import { Injectable } from '@angular/core';
import { Employee } from '../../models/employee.class';
import { Transfer } from '../../models/transfer.class';
import { FirestoreService } from '../firestore/firestore.service';
import { Subscription } from 'rxjs';
import { Contact } from '../../models/contact.class';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  employeesSubscriber = new Subscription;
  employees: Employee[] = [];

  transfersSubscriber = new Subscription;
  transfers: Transfer[] = [];

  contactsSubscriber = new Subscription;
  contacts: Contact[] = [];

  constructor(
    private firestoreService: FirestoreService) {

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
  }

  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
    this.transfersSubscriber.unsubscribe();
    this.contactsSubscriber.unsubscribe();
  }




  //Cashflow-Graph

  returnTopEmployee(employeesList: Employee[], transfersSortedLastSixMonths: Transfer[][]) {

    let revenuesByEmployee: { employeeId: string, revenue: number }[] = [];

    for (let i = 0; i < employeesList.length; i++) {
      const employee = employeesList[i];

      revenuesByEmployee.push(
        this.computeTotalRevenueOfEmployee(employee, transfersSortedLastSixMonths)
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

  //Overview Box
  returnDatabaseLength(database: 'employees' | 'transfers' | 'contacts'): number | undefined {

    switch (database) {

      case 'employees': return this.employees.length;

      case 'transfers': return this.transfers.length;

      case 'contacts': return this.contacts.length;

      default: return undefined;
    }
  }
}
