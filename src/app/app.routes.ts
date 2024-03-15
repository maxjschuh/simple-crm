import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

import { TransfersTableComponent } from './transfers/transfers-table/transfers-table.component';
import { TransferDetailComponent } from './transfers/transfer-detail/transfer-detail.component';
import { ContactsTableComponent } from './contacts/contacts-table/contacts-table.component';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';
import { EmployeesTableComponent } from './employees/employees-table/employees-table.component';
import { EmployeeDetailComponent } from './employees/employee-detail/employee-detail.component';

export const routes: Routes = [
    { path: "", component: ContactsTableComponent, title: ""},
    { path: "dashboard", component: DashboardComponent, title: "Simple-CRM | Dashboard"},
    { path: "contact", component: ContactsTableComponent, title: "Simple-CRM | Contact"}, 
    { path: "contact/:id", component: ContactDetailComponent, title: "Simple-CRM | Contact-Details" },
    { path: "transfers", component: TransfersTableComponent, title: "Simple-CRM | Transfers" },
    { path: "transfer/:id", component: TransferDetailComponent, title: "Simple-CRM | Transfer-Details" },
    { path: "employees", component: EmployeesTableComponent, title: "Simple-CRM | Employees" },
    { path: "employee/:id", component: EmployeeDetailComponent, title: "Simple-CRM | Employee-Details" }
];
