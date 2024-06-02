import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserNews } from './usernews';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UserNewsService {

	constructor(private httpClient: HttpClient) { }

	getUserNews(): Observable<UserNews[]> {
		return this.httpClient.get<UserNews[]>('/rest/news/user');
	}

	acknowledge(newsId: number): Observable<void> {
		return this.httpClient.post<void>('/rest/news/user/acknowledge', [newsId]);
	}
}