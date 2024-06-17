import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { Transfer } from '../../models/transfer.class';
import { AppTitleService } from '../../services/app-title/app-title.service';


@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule, MatAccordion, MatExpansionModule, RouterModule],
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.scss'
})
export class ContactDetailComponent implements OnInit {

  private routeSubscriber = new Subscription;
  contactsSubscriber = new Subscription;
  transfersSubscriber = new Subscription;
  contact = new Contact();
  contactId = '';
  transfers: Transfer[] = [];

  @ViewChild(MatAccordion) accordion!: MatAccordion;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    public dialog: MatDialog,
    public commonService: CommonService,
    private titleService: AppTitleService) {
  }


  /**
   * Extracts the id of the contact to display from the current url params and calls the init() function.
   */
  ngOnInit(): void {

    this.routeSubscriber.unsubscribe();

    this.routeSubscriber = this.route.params.subscribe(params => {

      this.contactId = params['id'];
      this.init();
    });
  }


  /**
   * Creates subscriptions to the datasets and sets the title in the header menu as "Contact-Details". When a subscription receives an update, the data in the component is updated.
   */
  init(): void {

    this.contactsSubscriber.unsubscribe();

    this.contactsSubscriber =
      this.firestoreService
        .contactsFrontendDistributor
        .subscribe(() => {

          this.contact =
            this.commonService
              .getDocumentFromCollection('contacts', this.contactId, Contact);

          this.transfersSubscriber.unsubscribe();

          this.transfersSubscriber = this.firestoreService.transfersFrontendDistributor.subscribe(() => {

            this.transfers = this.commonService.returnTransactionsOfContact(this.contactId);
          });

          this.titleService.titleDistributor.next('Contact-Details');
        });
  }


  /**
   * Unsubscribes from all subscriptions in this component.
   */
  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe();
    this.contactsSubscriber.unsubscribe();
    this.transfersSubscriber.unsubscribe();
  }


  /**
   * Opens the dialog for editing a contact. The "data" object is used to pass information to the dialog.
   * @param {string} fieldsToEdit data fields that should be shown in the edit dialog
   */
  openEditContactDialog(fieldsToEdit: 'name+email+phone' | 'address' | 'birthDate' | 'all'): void {

    const data: dataForEditDialog = {
      fieldsToEdit: fieldsToEdit,
      document: new Contact(this.contact)
    };

    this.dialog.open(DialogEditContactComponent, { data: data });
  }


  /**
   * Opens the dialog for deleting a contact.
   */
  openDeleteContactDialog(): void {

    this.dialog.open(DialogDeleteContactComponent, { data: this.contact });
  }
}
