import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
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
  isMobileView: boolean = true;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('toggleSidenavButton') toggleSidenavButton!: MatButton;

  constructor(
    private titleService: AppTitleService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private breakpointObserver: BreakpointObserver) {

    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd &&
        this.sidenav.opened &&
        this.isMobileView) {

        this.sidenav.close();
        this.toggleSidenavButton._elementRef.nativeElement.blur();
      }
    });
  }


  /**
   * Implements a method that sets the boolean variable "isMobileView" to true if the viewport width is less than 800 pixels.
   */
  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 800px)']).subscribe(result => {
      this.isMobileView = result.matches;
    });
  }


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
