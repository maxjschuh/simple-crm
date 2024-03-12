import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user.class';
import { FirestoreService } from '../services/firestore/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { BirthDateService } from '../services/birth-date/birth-date.service';
import { MatMenuModule } from '@angular/material/menu';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { MatDialog } from '@angular/material/dialog';
import { dataForEditDialog } from '../interfaces/data-for-edit-dialog.interface';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {

  private routeSubscriber = new Subscription;
  usersSubscriber: any;
  editsSubscriber: any;
  user: User = new User();
  userId = '';

  constructor(private route: ActivatedRoute, private firestoreService: FirestoreService, public birthDateService: BirthDateService, public dialog: MatDialog) { }

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
    this.usersSubscriber.unsubscribe();
    // this.editsSubscriber.unsubscribe();

  }


  getUserFromUserList(userList: User[]): void {

    for (let i = 0; i < userList.length; i++) {
      const user = userList[i];

      if (user.id === this.userId) {

        this.user = new User(user);
        return;
      }
    }
  }

  openDialog(fieldsToEdit: 'name+email' | 'address' | 'birthDate' | 'all'): void {

    const data: dataForEditDialog = {
      fieldsToEdit: fieldsToEdit,
      user: new User(this.user)
    };


    const dialogRef = this.dialog.open(DialogEditUserComponent, { data: data });

    this.editsSubscriber = dialogRef.componentInstance.savedEdits.subscribe((eventData: any) => {
      this.user = new User(eventData)
    });

    dialogRef.afterClosed().subscribe(result => { });
  }
}
