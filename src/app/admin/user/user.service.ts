import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { User } from './user';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
	constructor(private httpClient: HttpClient) {}

	getLoggedInUser(): Observable<User> {
		return this.httpClient.get<User>(this.userUrl() + '/me');
	}

	login(user, password): Observable<unknown> {
		const params = new HttpParams()
			.set('username', user)
			.set('password', password)
			.set('submit', 'Login');
		return this.httpClient.post<User>(this.loginUrl(), params);
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
