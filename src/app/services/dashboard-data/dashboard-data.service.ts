import { Injectable } from '@angular/core';
import { Employee } from '../../models/employee.class';
import { Transfer } from '../../models/transfer.class';
import { FirestoreService } from '../firestore/firestore.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from '../common/common.service';


@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  employeesSubscriber = new Subscription;
  employees: Employee[] = [];

  transfersSubscriber = new Subscription;
  transfers: Transfer[] = [];

  transfersByLastSixMonths: any[] = [];

  topEmployeeFrontendDistributor = new BehaviorSubject<{ id: string, revenue: number, data: Employee }>({ id: '', revenue: 0, data: new Employee() });


  constructor(private firestoreService: FirestoreService,
    private commonService: CommonService
  ) {

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe(employees => {
          this.employees = employees;
          this.emitTopEmployee();
        });

    this.transfersSubscriber =
      this.firestoreService
        .transfersFrontendDistributor
        .subscribe(transfers => {
          this.transfers = transfers;
          this.transfersByLastSixMonths = this.returnTransfersLastSixMonths();
          this.emitTopEmployee();
        });

  }


  /**
   * Unsubscribes from all subscriptions in this service.
   */
  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
    this.transfersSubscriber.unsubscribe();
  }



  //-------------------------------------
  //"Sales" line graph (total sales for each of the last six months)
  //-------------------------------------


  /**
   * Returns an array containing an array of transfer objects for each of the last six months.
   * @returns transfers of last six months
   */
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


  /**
   * Returns an array that contains the sum of sales for each of the last six months.
   * @returns sales of last six months
   */
  returnSalesLastSixMonths(): number[] {

    this.transfersByLastSixMonths = this.returnTransfersLastSixMonths();

    let salesSumByMonth: number[] = [];

    for (let i = 0; i < this.transfersByLastSixMonths.length; i++) {
      const transfersMonthly = this.transfersByLastSixMonths[i];
      let sum = 0;

      for (let j = 0; j < transfersMonthly.length; j++) {
        const transfer = transfersMonthly[j];

        if (transfer.type === 'Sale') sum = sum + transfer.amount;
      }

      salesSumByMonth.push(sum);
    }

    return salesSumByMonth;
  }


  /**
   * Returns an array containing the names of the last six months.
   * @returns the english names of the last six months
   */
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



  //-------------------------------------
  //"Most" sales employee info box (employe with highest total sales value in the last six months)
  //-------------------------------------


  /**
   * Manages several functions for finding the employee that closed the highest value in sale transactions. First function in call stack for finding the top closing employee.
   * @returns object with document id for an employee and his / her total sales revenue
   */
  emitTopEmployee(): void {

    let revenuesByEmployee: { employeeId: string, revenue: number }[] = [];

    this.transfersByLastSixMonths = this.returnTransfersLastSixMonths();

    for (let i = 0; i < this.employees.length; i++) {
      const employee = this.employees[i];

      revenuesByEmployee.push(
        this.computeTotalRevenueOfEmployee(employee, this.transfersByLastSixMonths)
      );
    }

    const topEmployee = this.returnEmployeeWithHighestRevenue(revenuesByEmployee);

    if (topEmployee.id) {

      topEmployee.data = this.commonService.getDocumentFromCustomCollection(this.employees, topEmployee.id, Employee);
    }

    this.topEmployeeFrontendDistributor.next(topEmployee);
  }


  /**
   * Computes total value of sale transactions of the employee that is passed as parameter.
   * @param employee 
   * @param transfersByLastSixMonths all transfers that happened in the last six months
   * @returns object with document id for the specific employee and his / her total sales revenue
   */
  computeTotalRevenueOfEmployee(
    employee: Employee,
    transfersByLastSixMonths: Transfer[][]): { employeeId: string, revenue: number } {

    let revenue = 0;

    for (let i = 0; i < transfersByLastSixMonths.length; i++) {
      const transfersMonthly = transfersByLastSixMonths[i];

      for (let j = 0; j < transfersMonthly.length; j++) {
        const transfer = transfersMonthly[j];

        if (transfer.closedById === employee.id && transfer.amount > 0) {

          revenue = revenue + transfer.amount;
        }
      }
    }

    return { employeeId: employee.id, revenue: revenue };
  }


  /**
   * Finds the employee with the highest sales value out of an array of employee sales data
   * @param revenuesByEmployee array of objects containing the employee id and his / her total sales value 
   * @returns object with document id for an employee and his / her total sales revenue
   */
  returnEmployeeWithHighestRevenue(
    revenuesByEmployee: { employeeId: string, revenue: number }[]): { id: string, revenue: number, data: Employee } {

    let topDealer = { id: '', revenue: 0, data: new Employee() };

    for (let i = 0; i < revenuesByEmployee.length; i++) {
      const revenueEmployee = revenuesByEmployee[i];

      if (revenueEmployee.revenue > topDealer.revenue) {

        topDealer.id = revenueEmployee.employeeId;
        topDealer.revenue = revenueEmployee.revenue;
      }
    }

    return topDealer;
  }



  //-------------------------------------
  //"Transaction types" pie chart (portion of each transaction type "sale", "refund" and "purchase")
  //-------------------------------------


  /**
   * Computes how many transactions of each transaction type are in the database and returns the result as array
   * @returns array with 3 number items that informs about the amount of sales (at index 0), the amount of purchases (at index 1) and amount of refunds (at index 2)
   */
  returnPieChartData(): [number, number, number] {

    let transfersByType: [number, number, number] = [0, 0, 0];

    for (let i = 0; i < this.transfers.length; i++) {
      const transfer = this.transfers[i];

      switch (transfer.type) {

        case 'Sale': transfersByType[0]++;
          break;

        case 'Purchase': transfersByType[1]++;
          break;

        case 'Refund': transfersByType[2]++;
          break;

        default:
          break;
      }
    }

    return transfersByType;
  }
}