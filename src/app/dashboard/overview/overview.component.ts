import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CommonService } from '../../services/common/common.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [MatCardModule, RouterModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {

  constructor(
    public commonService: CommonService
  ) { }

}
