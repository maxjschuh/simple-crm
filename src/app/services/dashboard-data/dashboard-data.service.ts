import { Injectable } from '@angular/core';
import { Employee } from '../../models/employee.class';
import { Transfer } from '../../models/transfer.class';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor() { }




  //Cashflow-Graph

  returnTopEmployee(employeesList: Employee[], transfersSortedLastSixMonths: Transfer[][]) {

    let revenuesByEmployee: {employeeId: string, revenue: number}[] = [];

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
    transfersByLastSixMonths: Transfer[][]): {employeeId: string, revenue: number} {

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

    return {employeeId: employee.id, revenue: revenue};
  }


  returnEmployeeWithHighestRevenue(
    revenuesByEmployee: {employeeId: string, revenue: number}[]): {employeeId: string, revenue: number}  {

    let topDealer = {employeeId: '', revenue: 0};

    for (let i = 0; i < revenuesByEmployee.length; i++) {
      const revenueEmployee = revenuesByEmployee[i];

      if (revenueEmployee.revenue > topDealer.revenue) {

        topDealer = {employeeId: revenueEmployee.employeeId, revenue: revenueEmployee.revenue};
      }
    }

    return topDealer;
  }
}
