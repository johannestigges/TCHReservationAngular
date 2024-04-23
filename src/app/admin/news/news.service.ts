import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { News } from './news';
import { Observable } from 'rxjs';
import { UserNews } from './usernews';

@Injectable({ providedIn: 'root' })
export class NewsService {
	constructor(private httpClient: HttpClient) { }

	getAll(): Observable<News[]> {
		return this.httpClient.get<News[]>('/rest/news/all');
	}

	getOne(id: number) {
		return this.httpClient.get<News>('/rest/news/one/' + id);
	}

	add(news: News): Observable<News> {
		return this.httpClient.post<News>('/rest/news', news);
	}

	update(news: News): Observable<News> {
		return this.httpClient.put<News>('/rest/news', news);
	}

	delete(id: number): Observable<void> {
		return this.httpClient.delete<void>('/rest/news/id/' + id);
	}

	getUserNews(): Observable<UserNews[]> {
		return this.httpClient.get<UserNews[]>('/rest/news/user');
	}

	acknowledge(newsId: number): Observable<void> {
		return this.httpClient.post<void>('/rest/news/user/acknowledge', [newsId]);
	}
}
