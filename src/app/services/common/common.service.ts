import { Injectable, Type } from '@angular/core';
import { User } from '../../models/user.class';
import { Transfer } from '../../models/transfer.class';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  getDocumentFromCollection(
    collection: User[] | Transfer[],
    documentId: string,
    constructor: Type<User | Transfer>
  ): any {

    for (let i = 0; i < collection.length; i++) {
      const document = collection[i];

      if (document.id === documentId) return new constructor();
    }

    return new User();
  }
}
