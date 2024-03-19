import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from '../../models/contact.class';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { DateService } from '../../services/date/date.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { dataForEditDialog } from '../../interfaces/data-for-edit-dialog.interface';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonService } from '../../services/common/common.service';
import { DialogDeleteContactComponent } from '../dialog-delete-contact/dialog-delete-contact.component';
import { DialogEditContactComponent } from '../dialog-edit-contact/dialog-edit-contact.component';


@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent implements OnInit {

  private routeSubscriber = new Subscription;
  contactsSubscriber = new Subscription;
  editsSubscriber = new Subscription;
  contact = new Contact();
  contactId = '';

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    public dialog: MatDialog,
    private commonService: CommonService) { }


  ngOnInit(): void {

    this.routeSubscriber = this.route.params.subscribe(params => {
      this.contactId = params['id'];
    });

    this.contactsSubscriber =
      this.firestoreService
        .contactsFrontendDistributor
        .subscribe(() => {
          this.contact = this.commonService.getDocumentFromCollection('contacts', this.contactId, Contact);
        });
  }


  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe();
    this.contactsSubscriber.unsubscribe();
    // this.editsSubscriber.unsubscribe();

  }


  openEditContactDialog(fieldsToEdit: 'name+email+phone' | 'address' | 'birthDate' | 'all'): void {

    const data: dataForEditDialog = {
      fieldsToEdit: fieldsToEdit,
      document: new Contact(this.contact)
    };

    const dialogRef = this.dialog.open(DialogEditContactComponent, { data: data });

    this.editsSubscriber = dialogRef.componentInstance.savedEdits.subscribe((eventData: any) => {
      this.contact = new Contact(eventData);
    });

  }

  
  openDeleteContactDialog(): void {

    this.dialog.open(DialogDeleteContactComponent, { data: this.contact });
  }
}
