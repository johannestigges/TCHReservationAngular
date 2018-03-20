import { Injectable } from '@angular/core';
import { User } from './user';
import { UserRole } from './user-role.enum';

@Injectable()
export class UserService {

  constructor() { }


  getUser(id: number): User {
    if (id == 1) {
      return new User(id, "Johannes Tigges", UserRole.ADMIN);
    }
    if (id == 2) {
      return new User(id, "Karsten Echte", UserRole.TRAINER);
    }
    if (id == 3) {
      return new User(id, "Ulrich Holtstiege", UserRole.REGISTERED);
    }
    if (id == 4) {
      return new User(id, "", UserRole.KIOSK);
    }
    return new User(id, "", UserRole.ANONYMOUS);
  }

}