import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscribable } from 'rxjs';
import { Firestore, collectionData, collection, doc, addDoc, setDoc, updateDoc, deleteDoc, DocumentReference, CollectionReference } from '@angular/fire/firestore';
import { Contact } from '../../models/contact.class';
import { Transfer } from '../../models/transfer.class';
import { Employee } from '../../models/employee.class';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);

  contacts$: Observable<any[]>;
  contactsBackendSubscriber: any;
  contactsFrontendDistributor = new BehaviorSubject<Contact[]>([]);

  transfers$: Observable<any[]>;
  transfersBackendSubscriber: any;
  transfersFrontendDistributor = new BehaviorSubject<Transfer[]>([]);

  employees$: Observable<any[]>;
  employeesBackendSubscriber: any;
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


  ngOnDestroy(): void {

    this.contactsBackendSubscriber.unsubscribe();
    this.transfersBackendSubscriber.unsubscribe();
    this.employeesBackendSubscriber.unsubscribe();
  }


  getBackendSubscriber(collectionId: string) {

    const collection = this.getCollectionRef(collectionId);
    return collectionData(collection, { idField: 'id' });
  }


  getCollectionRef(collectionId: string): CollectionReference {

    return collection(this.firestore, collectionId);
  }


  getSingleDocumentRef(collectionId: string, documentId: string): DocumentReference {

    return doc(this.getCollectionRef(collectionId), documentId);
  }


  async addDocument(collectionId: string, item: object): Promise<void> {

    await addDoc(this.getCollectionRef(collectionId), item)
      .catch(() => {

      })
  }


  async updateDocument(collectionId: string, documentId: string, updatedDocument: object): Promise<void> {

    const doc = this.getSingleDocumentRef(collectionId, documentId);

    await setDoc(doc, updatedDocument);
  }

  async updateSingleField(collectionId: string, documentId: string, fieldToUpdate: string, valueToSet: any): Promise<void> {//currently not in use

    const doc = this.getSingleDocumentRef(collectionId, documentId);

    await updateDoc(doc, { fieldToUpdate: valueToSet });
  }


  async deleteDocument(collectionId: string, documentId: string): Promise<void> {

    const doc = this.getSingleDocumentRef(collectionId, documentId);
    await deleteDoc(doc);
  }
}