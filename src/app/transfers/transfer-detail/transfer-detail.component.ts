import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
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

@Component({
  selector: 'app-transfer-detail',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './transfer-detail.component.html',
  styleUrl: './transfer-detail.component.scss'
})
export class TransferDetailComponent {

  private routeSubscriber = new Subscription;
  transfersSubscriber = new Subscription;
  editsSubscriber = new Subscription;
  transfer = new Transfer();
  transferId = '';


  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    public dateService: DateService,
    public dialog: MatDialog,
    private commonService: CommonService) { }


  ngOnInit(): void {

    this.routeSubscriber = this.route.params.subscribe(params => {
      this.transferId = params['id'];
    });

    this.transfersSubscriber =
      this.firestoreService
        .transfersFrontendDistributor
        .subscribe(() => {

          this.transfer =
            this.commonService
              .getDocumentFromCollection('transfers', this.transferId, Transfer);
        });
  }


  ngOnDestroy(): void {
    this.routeSubscriber.unsubscribe();
    this.transfersSubscriber.unsubscribe();
    // this.editsSubscriber.unsubscribe();
  }


  openEditTransferDialog(fieldsToEdit: 'all' | 'title' | 'payer+recipient' | 'type+amount' | 'closedBy+date' | 'description'): void {

    const data: dataForEditDialog = {
      fieldsToEdit: fieldsToEdit,
      document: new Transfer(this.transfer)
    };

    const dialogRef = this.dialog.open(DialogEditTransferComponent, { data: data });

    this.editsSubscriber = dialogRef.componentInstance.savedEdits.subscribe((eventData: any) => {
      this.transfer = new Transfer(eventData)
    });
  }


  openDeleteTransferDialog():void {

    this.dialog.open(DialogDeleteTransferComponent, { data: this.transfer });
  }
}
