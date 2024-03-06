import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: "", component: UserComponent, title: ""},
    { path: "dashboard", component: DashboardComponent, title: "Simple-CRM | Dashboard"},
    { path: "user", component: UserComponent, title: "Simple-CRM | User"}
];
