import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { User } from './user';
import { UserRole } from './user-role.enum';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient) {
  }

  getLoggedInUser(): Observable<User> {
    return this.httpClient.get<User>('/user/me');
  }

  login(user, password): Observable<any> {
    //const headers = new HttpHeaders().set('authorization', 'Basic ' + btoa(user + ':' + password));
    //return this.httpClient.get('/user', {headers});

    const params = new HttpParams()
      .set('username', user)
      .set('password', password)
      .set('submit','Login');
    return this.httpClient.post<User>('/login', params);
  }

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>('/user/getAll');
  }


  getUser(id: number): Observable<User> {
    return this.httpClient.get<User>('/user/get/' + id);
  }

  addUser(user: User): Observable<User> {
    return this.httpClient.post<User>('/user/add', user);
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>('/user/', user);
  }
}
