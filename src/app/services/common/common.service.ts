import { Injectable, Type } from '@angular/core';
import { Contact } from '../../models/contact.class';
import { Transfer } from '../../models/transfer.class';
import { Employee } from '../../models/employee.class';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../firestore/firestore.service';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  employeesSubscriber = new Subscription;
  employees: Employee[] = [];

  transfersSubscriber = new Subscription;
  transfers: Transfer[] = [];

  contactsSubscriber = new Subscription;
  contacts: Contact[] = [];

  constructor(
    private firestoreService: FirestoreService) {

    this.employeesSubscriber =
      this.firestoreService
        .employeesFrontendDistributor
        .subscribe(employees => {
          this.employees = employees;
        });

    this.transfersSubscriber =
      this.firestoreService
        .transfersFrontendDistributor
        .subscribe(transfers => {
          this.transfers = transfers;
        });

    this.contactsSubscriber =
      this.firestoreService
        .contactsFrontendDistributor
        .subscribe(contacts => {
          this.contacts = contacts;
        });
  }

  
  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
    this.transfersSubscriber.unsubscribe();
    this.contactsSubscriber.unsubscribe();
  }

  
  getDocumentFromCollection(
    collection: 'employees' | 'transfers' | 'contacts',
    documentId: string,
    constructor: Type<Contact | Transfer | Employee>
  ): any {

    const coll = this.returnCollectionByName(collection);

    if (!coll) throw new Error;

    for (let i = 0; i < coll.length; i++) {
      const document = coll[i];

      if (document.id === documentId) return new constructor(document);
    }

    return new constructor();
  }


  returnCollectionByName(
    collection: 'employees' | 'transfers' | 'contacts'
  ): Employee[] | Transfer[] | Contact[] {

    switch (collection) {

      case 'employees': return this.employees;

      case 'transfers': return this.transfers;

      case 'contacts': return this.contacts;

      default: return [];
    }
  }
}
