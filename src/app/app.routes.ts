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
    { path: '', component: DashboardComponent, title: 'Easy-CRM | Dashboard'},
    { path: 'dashboard', component: DashboardComponent, title: 'Easy-CRM | Dashboard'},
    { path: 'contacts', component: ContactsTableComponent, title: 'Easy-CRM | Contacts'}, 
    { path: 'contacts/:id', component: ContactDetailComponent, title: 'Easy-CRM | Contact-Details' },
    { path: 'transfers', component: TransfersTableComponent, title: 'Easy-CRM | Transactions' },
    { path: 'transfers/:id', component: TransferDetailComponent, title: 'Easy-CRM | Transaction-Details' },
    { path: 'employees', component: EmployeesTableComponent, title: 'Easy-CRM | Employees' },
    { path: 'employees/:id', component: EmployeeDetailComponent, title: 'Easy-CRM | Employee-Details' },
    { path: 'imprint', component: ImprintComponent, title: 'Easy-CRM | Imprint'},
    { path: 'data-protection', component: DataProtectionComponent, title: 'Easy-CRM | Data protection'}
];