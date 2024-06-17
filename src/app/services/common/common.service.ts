import { Injectable, Type } from '@angular/core';
import { Contact } from '../../models/contact.class';
import { Transfer } from '../../models/transfer.class';
import { Employee } from '../../models/employee.class';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../firestore/firestore.service';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';


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

    this.employeesSubscriber.unsubscribe();
    this.transfersSubscriber.unsubscribe();
    this.contactsSubscriber.unsubscribe();

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


  /**
   * Unsubscribes from all subscriptions in this component.
   */
  ngOnDestroy(): void {
    this.employeesSubscriber.unsubscribe();
    this.transfersSubscriber.unsubscribe();
    this.contactsSubscriber.unsubscribe();
  }


  /**
   * Finds a document in a collection by its id and returns it (as object).
   * @param collection 
   * @param documentId 
   * @param constructor corresponding to the collection 
   * @returns document (contact, employee or transfer)
   */
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


  /**
   * Returns the corresponding collection to the term that is passed as parameter.
   * @param collection 
   * @returns array of contacts, employees or transfers (called "transaction" in the UI)
   */
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

  
  /**
   * Returns the document id of the person with the name that is passed as parameter.
   * @param name of the person whose id should be returned
   * @param collection where the person should be found (contacts or employees)
   * @returns document id as string
   */
  returnIdByName(
    name: string,
    collection: Employee[] | Contact[]
  ): string {

    const person = this.returnPersonByName(name, collection);

    if (!person) return '';

    else return person.id;
  }


  /**
   * Returns the person (object) with the name that is passed as parameter.
   * @param name of the person
   * @param collection where the person should be found (contacts or employees)
   * @returns object of type Contact or Employee
   */
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


  /**
   * Creates an array of name strings from an collection. Used in the person pickers.
   * @param collection from which the names should be taken
   * @returns array of name strings (firstname and lastname separated by comma)
   */
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


  /**
   * Converts a person name from the format "lastname, firstname" to the format "firstname lastname".
   * @param lastNameCommaFirstName name in the format "lastname, firstname"
   * @returns name in the format "firstname lastname"
   */
  returnFormattedName(
    lastNameCommaFirstName: string
  ): string {

    const lastName = lastNameCommaFirstName.split(',')[0];
    const firstName = lastNameCommaFirstName.split(',')[1].slice(1);

    return firstName + ' ' + lastName;
  }


  /**
   * Returns the url parameters for navigating to the details page of the person whose id is passed as parameter.
   * @param type 
   * @param id document id of the person
   * @returns url parameters as string (for use in routerLink)
   */
  returnLinkToPerson(
    type: '/employees' | '/contacts',
    id: string
  ): string[] {

    if (id) return [type, id];

    else return [];
  }


  /**
   * Returns all transfers (called "transactions" in the UI), in which the contact who is passed as parameter is involved.
   * @param contactId document id of the contact whose transfers should be returned
   * @returns array of transfers
   */
  returnTransactionsOfContact(contactId: string): Transfer[] {

    let transactions: Transfer[] = [];

    for (let i = 0; i < this.transfers.length; i++) {
      const transfer = this.transfers[i];

      if (
        transfer.payerId === contactId ||
        transfer.recipientId === contactId
      ) {
        transactions.push(transfer);
      }
    }

    return transactions;
  }


  /**
   * Returns all transfers (called "transactions" in the UI), in which the employee who is passed as parameter is specified in the key "closedBy".
   * @param employeeId document id of the contact whose closings should be returned
   * @returns array of transfers
   */
  returnClosingsOfEmployee(employeeId: string): Transfer[] {

    let closings: Transfer[] = [];

    for (let i = 0; i < this.transfers.length; i++) {
      const transfer = this.transfers[i];

      if (transfer.closedById === employeeId) closings.push(transfer);
    }

    return closings;
  }


  /**
   * Input validator that checks if a number value is greater than zero
   * @returns validator function
   */
  greaterThanZeroValidator(): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (value !== null && value <= 0) return { 'greaterThanZero': true };

      return null;
    }
  }
}