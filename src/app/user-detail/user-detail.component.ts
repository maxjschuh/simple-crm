import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user.class';
import { FirestoreService } from '../services/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { BirtDateService } from '../services/birt-date.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDividerModule, MatIconModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {

  private routeSubscriber = new Subscription;
  usersSubscriber: any;
  user = new User();
  userId = '';

  constructor(private route: ActivatedRoute, private firestoreService: FirestoreService, public birthDateService: BirtDateService) { }

  ngOnInit(): void {

    this.routeSubscriber = this.route.params.subscribe(params => {
      this.userId = params['id'];
    });

    this.usersSubscriber = this.firestoreService.usersFrontendDistributor.subscribe((userList: User[]) => {
      this.getUserFromUserList(userList);
    });
  }


  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe();
  }


  getUserFromUserList(userList: User[]): void {

    for (let i = 0; i < userList.length; i++) {
      const user = userList[i];

      if (user.id === this.userId) {

        this.user = user;
        return;
      }
    }
  }
}
