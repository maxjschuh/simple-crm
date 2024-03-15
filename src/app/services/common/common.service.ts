import { Injectable, Type } from '@angular/core';
import { Contact } from '../../models/contact.class';
import { Transfer } from '../../models/transfer.class';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  getDocumentFromCollection(
    collection: Contact[] | Transfer[],
    documentId: string,
    constructor: Type<Contact | Transfer>
  ): any {

    for (let i = 0; i < collection.length; i++) {
      const document = collection[i];

      if (document.id === documentId) return new constructor(document);
    }

    return new constructor();
  }
}
