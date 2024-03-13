import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Firestore, collectionData, collection, doc, addDoc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { User } from '../../models/user.class';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);
  users$: Observable<any[]>;
  usersBackendSubscriber: any;
  usersFrontendDistributor = new BehaviorSubject<User[]>([]);


  constructor() {

    this.users$ = this.getBackendSubscriber('users');

    this.usersBackendSubscriber = this.users$
      .subscribe((userList) => {

        this.usersFrontendDistributor.next(userList);
      });

  }


  ngOnDestroy(): void {

    this.usersBackendSubscriber.unsubscribe();
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

    await updateDoc(doc, { fieldToUpdate: valueToSet});
  }


  async deleteDocument(collectionId: string, documentId: string) {

    const doc = this.getSingleDocumentRef(collectionId, documentId);
    await deleteDoc(doc);
  }
}