import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);
  users$: Observable<any[]>;
  users!: any;

  constructor() {

    const usersCollection = this.getCollectionRef('users');
    this.users$ = collectionData(usersCollection);

    this.users = this.users$.subscribe((userList) => {
      userList.forEach(user => {
        // console.log(user);
      });
    })
  }


  ngOnDestroy(): void {

    this.users.unsubscribe();
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
}
