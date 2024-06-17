import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
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
import { Transfer } from '../../models/transfer.class';
import { DialogEditTransferComponent } from '../dialog-edit-transfer/dialog-edit-transfer.component';
import { DialogDeleteTransferComponent } from '../dialog-delete-transfer/dialog-delete-transfer.component';
import { AppTitleService } from '../../services/app-title/app-title.service';

@Component({
  selector: 'app-transfer-detail',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule, RouterModule],
  templateUrl: './transfer-detail.component.html',
  styleUrl: './transfer-detail.component.scss'
})
export class TransferDetailComponent implements OnInit {

  private routeSubscriber = new Subscription;
  transfersSubscriber = new Subscription;
  transfer = new Transfer();
  transferId = '';

  linkToPayer: string[] = [];
  linkToRecipient: string[] = [];
  linkToClosedBy: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    public dialog: MatDialog,
    public commonService: CommonService,
    private titleService: AppTitleService
  ) { }


  /**
   * Extracts the id of the contact to display from the current url params and calls the init() function.
   */
  ngOnInit(): void {

    this.routeSubscriber.unsubscribe();

    this.routeSubscriber = this.route.params.subscribe(params => {

      this.transferId = params['id'];
      this.init();
    });
  }


  /**
   * Creates subscriptions to the datasets and sets the title in the header menu as "Transaction-Details". When a subscription receives an update, the data in the component is updated.
   */
  init(): void {

    this.transfersSubscriber.unsubscribe();

    this.transfersSubscriber =
      this.firestoreService
        .transfersFrontendDistributor
        .subscribe(() => {

          this.transfer =
            this.commonService
              .getDocumentFromCollection('transfers', this.transferId, Transfer);

          this.linkToPayer = this.commonService.returnLinkToPerson('/contacts', this.transfer.payerId);
          this.linkToRecipient = this.commonService.returnLinkToPerson('/contacts', this.transfer.recipientId);
          this.linkToClosedBy = this.commonService.returnLinkToPerson('/employees', this.transfer.closedById);

          this.titleService.titleDistributor.next('Transaction-Details');
        });
  }


  /**
   * Unsubscribes from all subscriptions in this component.
   */
  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe();
    this.transfersSubscriber.unsubscribe();
  }


  /**
   * Opens the dialog for editing a transaction. The "data" object is used to pass information to the dialog.
   * @param {string} fieldsToEdit data fields that should be shown in the edit dialog
   */
  openEditTransferDialog(fieldsToEdit: 'all' | 'title' | 'type+amount+payer+recipient' | 'closedBy+date' | 'description'): void {

    const data: dataForEditDialog = {
      fieldsToEdit: fieldsToEdit,
      document: new Transfer(this.transfer)
    };

    this.dialog.open(DialogEditTransferComponent, { data: data });
  }


  /**
   * Opens the dialog component for deleting the selected transaction.
   */
  openDeleteTransferDialog(): void {

    this.dialog.open(DialogDeleteTransferComponent, { data: this.transfer });
  }
}