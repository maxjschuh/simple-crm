import { Injectable } from '@angular/core';
import { User } from '../../models/user.class';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }


  getUserFromUserList(userList: User[], userId: string): User {

    for (let i = 0; i < userList.length; i++) {
      const user = userList[i];

      if (user.id === userId) return new User(user);
    }

    return new User();
  }
}
