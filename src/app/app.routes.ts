import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransfersTableComponent } from './transfers/transfers-table/transfers-table.component';
import { TransferDetailComponent } from './transfers/transfer-detail/transfer-detail.component';
import { ContactsTableComponent } from './contacts/contacts-table/contacts-table.component';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';
import { EmployeesTableComponent } from './employees/employees-table/employees-table.component';
import { EmployeeDetailComponent } from './employees/employee-detail/employee-detail.component';
import { ImprintComponent } from './imprint/imprint.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';

export const routes: Routes = [
    { path: "dashboard", component: DashboardComponent, title: "Simple-CRM | Dashboard"},
    { path: "contacts", component: ContactsTableComponent, title: "Simple-CRM | Contacts"}, 
    { path: "contacts/:id", component: ContactDetailComponent, title: "Simple-CRM | Contact-Details" },
    { path: "transfers", component: TransfersTableComponent, title: "Simple-CRM | Transactions" },
    { path: "transfers/:id", component: TransferDetailComponent, title: "Simple-CRM | Transaction-Details" },
    { path: "employees", component: EmployeesTableComponent, title: "Simple-CRM | Employees" },
    { path: "employees/:id", component: EmployeeDetailComponent, title: "Simple-CRM | Employee-Details" },
    { path: "imprint", component: ImprintComponent, title: "Simple CRM | Imprint"},
    { path: "data-protection", component: DataProtectionComponent, title: "Simple CRM | Data protection"}
];
