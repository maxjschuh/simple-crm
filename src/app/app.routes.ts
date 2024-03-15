import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

import { TransfersComponent } from './transfers/transfers-table/transfers-table.component';
import { TransferDetailComponent } from './transfers/transfer-detail/transfer-detail.component';
import { ContactsTableComponent } from './contacts/contacts-table/contacts-table.component';
import { ContactDetailComponent } from './contacts/contact-detail/contact-detail.component';

export const routes: Routes = [
    { path: "", component: ContactsTableComponent, title: ""},
    { path: "dashboard", component: DashboardComponent, title: "Simple-CRM | Dashboard"},
    { path: "contact", component: ContactsTableComponent, title: "Simple-CRM | Contact"}, 
    { path: "contact/:id", component: ContactDetailComponent, title: "Simple-CRM | Contact-Details" },
    { path: "transfers", component: TransfersComponent, title: "Simple-CRM | Transfers" },
    { path: "transfer/:id", component: TransferDetailComponent, title: "Simple-CRM | Transfer-Details" }
];
