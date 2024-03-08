import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, addDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.class';


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


  getSingleDocumentRef(collectionId: string, documentId: string) { //currently not in use

    return doc(this.getCollectionRef(collectionId), documentId);
  }


  async addDocument(collectionId: string, item: object) {

    await addDoc(this.getCollectionRef(collectionId), item)
      .catch(() => {

      })
  }
}
