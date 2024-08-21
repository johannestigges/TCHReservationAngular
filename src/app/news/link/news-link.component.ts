import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NewsService } from 'src/app/admin/news/news.service';
import { UserNewsService } from 'src/app/admin/news/user-news.service';
import { User } from 'src/app/admin/user/user';

@Component({
	selector: 'tch-news-link',
	standalone: false,
	templateUrl: './news-link.component.html'
})
export class NewsLinkComponent implements OnInit, OnChanges {

	@Input() loggedInUser: User = User.EMPTY;

	newsCount = 0;
	hasUnacknowledgedNews = false;

	constructor(
		private newsService: NewsService,
		private userNewsService: UserNewsService) {
	}

	ngOnInit(): void {
		this.newsService.getAll().subscribe(
			news => this.newsCount = news.length
		);
	}

	ngOnChanges(): void {
		this.userNewsService.getUserNews().subscribe(
			userNews => this.hasUnacknowledgedNews = userNews.length < this.newsCount
		);
	}
}
