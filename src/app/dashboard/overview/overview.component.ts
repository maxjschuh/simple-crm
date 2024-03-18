import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardDataService } from '../../services/dashboard-data/dashboard-data.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [MatCardModule, RouterModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

  constructor(
    public dataService: DashboardDataService
  ) {

  }

}
