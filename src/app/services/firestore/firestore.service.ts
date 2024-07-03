import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Firestore, collectionData, collection, doc, addDoc, setDoc, deleteDoc, DocumentReference, CollectionReference } from '@angular/fire/firestore';
import { Contact } from '../../models/contact.class';
import { Transfer } from '../../models/transfer.class';
import { Employee } from '../../models/employee.class';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);

  contacts$: Observable<any[]>;
  contactsBackendSubscriber = new Subscription;
  contactsFrontendDistributor = new BehaviorSubject<Contact[]>([]);

  transfers$: Observable<any[]>;
  transfersBackendSubscriber = new Subscription;
  transfersFrontendDistributor = new BehaviorSubject<Transfer[]>([]);

  employees$: Observable<any[]>;
  employeesBackendSubscriber = new Subscription;
  employeesFrontendDistributor = new BehaviorSubject<Employee[]>([]);


  constructor() {

    this.contacts$ = this.getBackendSubscriber('contacts');
    this.transfers$ = this.getBackendSubscriber('transfers');
    this.employees$ = this.getBackendSubscriber('employees');

    this.contactsBackendSubscriber =
      this.contacts$.subscribe(collection => {

        this.contactsFrontendDistributor.next(collection);
      });

    this.transfersBackendSubscriber =
      this.transfers$.subscribe(collection => {

        this.transfersFrontendDistributor.next(collection);
      });

    this.employeesBackendSubscriber =
      this.employees$.subscribe(collection => {

        this.employeesFrontendDistributor.next(collection);
      });
  }


  /**
   * Unsubscribes from all subscriptions in this service.
   */
  ngOnDestroy(): void {

    this.contactsBackendSubscriber.unsubscribe();
    this.transfersBackendSubscriber.unsubscribe();
    this.employeesBackendSubscriber.unsubscribe();
  }


  /**
   * Returns a observable to the firestore collection that is passed as parameter.
   * @param collectionId name of the collection: "contacts", "employees" or "transfers"
   * @returns observable to a collection 
   */
  getBackendSubscriber(collectionId: string) {

    const collection = this.getCollectionRef(collectionId);
    return collectionData(collection, { idField: 'id' });
  }


  /**
   * Returns a collection reference to the collection that is passed as parameter
   * @param collectionId name of the collection: "contacts", "employees" or "transfers"
   * @returns CollectionReference
   */
  getCollectionRef(collectionId: string): CollectionReference {

    return collection(this.firestore, collectionId);
  }


  /**
   * Returns a reference to a single document that is 
   * @param collectionId name of the collection: "contacts", "employees" or "transfers"
   * @param documentId id of the document of interest
   * @returns DocumentReference
   */
  getSingleDocumentRef(collectionId: string, documentId: string): DocumentReference {

    return doc(this.getCollectionRef(collectionId), documentId);
  }


  /**
   * Adds a single document to the firestore.
   * @param collectionId name of the collection in which the document should be added: "contacts", "employees" or "transfers"
   * @param item object containing the data of the document to be added
   */
  async addDocument(collectionId: string, item: object): Promise<void> {

    await addDoc(this.getCollectionRef(collectionId), item);
  }


  /**
   * Overwrites a existing document with the data that is passed as parameter.
   * @param collectionId name of the collection in which the document to be updated is located: "contacts", "employees" or "transfers"
   * @param documentId id of the document to be updated
   * @param updatedDocument object containing updated document data
   */
  async updateDocument(collectionId: string, documentId: string, updatedDocument: object): Promise<void> {

    const doc = this.getSingleDocumentRef(collectionId, documentId);

    await setDoc(doc, updatedDocument);
  }


  /**
   * Deletes a single document from the firestore
   * @param collectionId name of the collection in which the document to be deleted is located: "contacts", "employees" or "transfers"
   * @param documentId id of the document to be deleted
   */
  async deleteDocument(collectionId: string, documentId: string): Promise<void> {

    const doc = this.getSingleDocumentRef(collectionId, documentId);
    await deleteDoc(doc);
  }
}