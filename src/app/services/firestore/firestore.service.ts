import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, collectionData, collection, doc, addDoc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Contact } from '../../models/contact.class';
import { Transfer } from '../../models/transfer.class';


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


  constructor() {

    this.contacts$ = this.getBackendSubscriber('users');
    this.transfers$ = this.getBackendSubscriber('transfers');

    this.contactsBackendSubscriber =
      this.contacts$.subscribe(contactList => {

        this.contactsFrontendDistributor.next(contactList);
      });

    this.transfersBackendSubscriber =
      this.transfers$.subscribe(transferList => {

        this.transfersFrontendDistributor.next(transferList);
      });
  }


  ngOnDestroy(): void {

    this.contactsBackendSubscriber.unsubscribe();
    this.transfersBackendSubscriber.unsubscribe();
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