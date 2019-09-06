import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { User } from './user';
import { UserRole } from './user-role.enum';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const URL = environment.restURL;
const USER_URL = URL + '/user/';

@Injectable()
export class UserService {


  constructor(private httpClient: HttpClient) {
  }

  getLoggedInUser(): Observable<User> {
    return this.httpClient.get<User>(USER_URL + 'me');
  }

  login(user, password): Observable<any> {
    // const headers = new HttpHeaders().set('authorization', 'Basic ' + btoa(user + ':' + password));
    // return this.httpClient.get('/user', {headers});

    const params = new HttpParams()
      .set('username', user)
      .set('password', password)
      .set('submit', 'Login');
    console.log('login user ' + user);
    return this.httpClient.post<User>(URL + '/login', params);
  }

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(USER_URL + 'all');
  }


  getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(USER_URL + id);
  }

  addUser(user: User): Observable<User> {
    return this.httpClient.post<User>(USER_URL, user);
  }

  updateUser(user: User): Observable<User> {
    return this.httpClient.put<User>(USER_URL, user);
  }
}
