import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { AppTitleService } from './services/app-title/app-title.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatSidenavModule, MatButtonModule, MatCheckboxModule, FormsModule, MatIconModule, MatListModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  title = '';
  titleSubscriber = new Subscription;

  constructor(
    private titleService: AppTitleService,
    private cd: ChangeDetectorRef) { }


  /**
   * Subscribes to the services that emits the current html document title.
   */
  ngAfterViewInit() {

    this.titleSubscriber.unsubscribe();

    this.titleSubscriber =
      this.titleService
        .titleDistributor
        .subscribe(title => {

          this.title = title;
          this.cd.detectChanges();
        });
  }
}
