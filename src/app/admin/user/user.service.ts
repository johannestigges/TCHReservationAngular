import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { User } from './user';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
	constructor(private httpClient: HttpClient) { }

	getLoggedInUser(): Observable<User> {
		return this.httpClient.get<User>(this.userUrl() + '/me');
	}

	login(user, password, rememberMe) {
		const headers = new HttpHeaders(
			{ 'content-type': 'application/x-www-form-urlencoded' });

		return this.httpClient.post('/login',
			`username=${user}&password=${password}&remember-me=${rememberMe}`,
			{ headers: headers, responseType: 'text' });
	}

	logout() {
		return this.httpClient.get('/logout', { responseType: 'text' });
	}

	getAll(): Observable<User[]> {
		return this.httpClient.get<User[]>(this.userUrl() + '/all');
	}

	getUser(id: number): Observable<User> {
		return this.httpClient.get<User>(this.userUrl() + '/' + id);
	}

	addUser(user: User): Observable<User> {
		return this.httpClient.post<User>(this.userUrl(), user);
	}

	updateUser(user: User): Observable<User> {
		return this.httpClient.put<User>(this.userUrl(), user);
	}

	private userUrl() {
		return '/rest/user';
	}

	private loginUrl() {
		return '/login';
	}
}
