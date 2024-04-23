import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NewsService } from 'src/app/admin/news/news.service';
import { User } from 'src/app/admin/user/user';
import { UserRole } from 'src/app/admin/user/user-role.enum';

@Component({
	selector: 'tch-news-link',
	standalone: false,
	templateUrl: './news-link.component.html',
	styleUrl: './news-link.component.scss'
})
export class NewsLinkComponent implements OnInit, OnChanges {

	@Input() loggedInUser: User = User.EMPTY;

	newsCount = 0;
	hasUnacknowledgedNews = false;

	constructor(private newsService: NewsService) { }

	ngOnInit(): void {
		this.newsService.getAll()
			.subscribe(news => this.newsCount = news.length);
	}

	ngOnChanges(): void {
		if (!this.loggedInUser.hasRole(UserRole.ANONYMOUS)) {
			this.newsService.getUserNews().subscribe(userNews =>
				this.hasUnacknowledgedNews = userNews.length < this.newsCount);
		}
	}
}
