import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user.class';
import { FirestoreService } from '../services/firestore/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { DateService } from '../services/date/date.service';
import { MatMenuModule } from '@angular/material/menu';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { MatDialog } from '@angular/material/dialog';
import { dataForEditDialog } from '../interfaces/data-for-edit-dialog.interface';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonService } from '../services/common/common.service';
import { DialogDeleteContactComponent } from '../dialog-delete-contact/dialog-delete-contact.component';


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
  user = new User();
  userId = '';

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService, 
    public dateService: DateService, 
    public dialog: MatDialog,
    private commonService: CommonService) { }

  ngOnInit(): void {

    this.routeSubscriber = this.route.params.subscribe(params => {
      this.userId = params['id'];
    });

    this.usersSubscriber = this.firestoreService.contactsFrontendDistributor.subscribe((userList: User[]) => {
      this.user = this.commonService.getUserFromUserList(userList, this.userId);
    });
  }


  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe();
    this.usersSubscriber.unsubscribe();
    // this.editsSubscriber.unsubscribe();

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

  }

  openDeleteUserDialog() {

    const data = {
      user: this.user
    };

    this.dialog.open(DialogDeleteContactComponent, { data: data });

  }
}
