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

  returnIdByName(
    name: string,
    collection: Employee[] | Contact[]
    ): string {

    const person =  this.returnPersonByName(name, collection);

    if (!person) return '';
     
    else return person.id;
  }


  returnPersonByName(
    name: string,
    collection: Employee[] | Contact[]
  ): Contact | Employee | void {

    const lastName = name.split(',')[0];
    const firstName = name.split(',')[1].slice(1);

    for (let i = 0; i < collection.length; i++) {
      const person = collection[i];

      if (
        firstName === person.firstName &&
        lastName === person.lastName

      ) return person;
    }
  }


  returnFormattedName(
    lastNameCommaFirstName: string
  ): string {

    const lastName = lastNameCommaFirstName.split(',')[0];
    const firstName = lastNameCommaFirstName.split(',')[1].slice(1);

    return firstName + ' ' + lastName;
  }



  returnDataForPersonPicker(collection: Contact[] | Employee[]): string[] {

    let pickerOptions = [];

    for (let i = 0; i < collection.length; i++) {
      const person = collection[i];

      if (person.id !== 'WjVzeiDUXvRcx8MVZBbq') { //person is not the owner of the database
        
        const fullName = person.lastName + ', ' + person.firstName;

        pickerOptions.push(fullName);
      }
    }

    return pickerOptions;
  }


  returnLinkToPerson(
    type: '/employee' | '/contact',
    id: string
  ): string[] {

    if (id) return [type, id];
      
    else return [];
  }
}
