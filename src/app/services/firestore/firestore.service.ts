import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, collectionData, collection, doc, addDoc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { Transaction } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);

  contacts$: Observable<any[]>;
  contactsBackendSubscriber: any;
  contactsFrontendDistributor = new BehaviorSubject<User[]>([]);

  transactions$: Observable<any[]>;
  transactionsBackendSubscriber: any;
  transactionsFrontendDistributor = new BehaviorSubject<Transaction[]>([]);


  constructor() {

    this.contacts$ = this.getBackendSubscriber('users');
    this.transactions$ = this.getBackendSubscriber('transactions');

    this.contactsBackendSubscriber =
      this.contacts$.subscribe(contactList => {

        this.contactsFrontendDistributor.next(contactList);
      });

    this.transactionsBackendSubscriber =
      this.transactions$.subscribe(transactionList => {

        this.transactionsFrontendDistributor.next(transactionList);
      });
  }


  ngOnDestroy(): void {

    this.contactsBackendSubscriber.unsubscribe();
    this.transactionsBackendSubscriber.unsubscribe();
  }


  getBackendSubscriber(collectionId: string) {

    const collection = this.getCollectionRef(collectionId);
    return collectionData(collection, { idField: 'id' });
  }


  getCollectionRef(collectionId: string) {

    return collection(this.firestore, collectionId);
  }


  getSingleDocumentRef(collectionId: string, documentId: string) {

    return doc(this.getCollectionRef(collectionId), documentId);
  }


  async addDocument(collectionId: string, item: object) {

    await addDoc(this.getCollectionRef(collectionId), item)
      .catch(() => {

      })
  }

  async updateDocument(collectionId: string, documentId: string, updatedDocument: object) {

    const doc = this.getSingleDocumentRef(collectionId, documentId);

    await setDoc(doc, updatedDocument);
  }

  async updateSingleField(collectionId: string, documentId: string, fieldToUpdate: string, valueToSet: any) {//currently not in use

    const doc = this.getSingleDocumentRef(collectionId, documentId);

    await updateDoc(doc, { fieldToUpdate: valueToSet });
  }


  async deleteDocument(collectionId: string, documentId: string) {

    const doc = this.getSingleDocumentRef(collectionId, documentId);
    await deleteDoc(doc);
  }
}