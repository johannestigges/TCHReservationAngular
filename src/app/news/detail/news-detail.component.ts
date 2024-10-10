import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { News } from 'src/app/admin/news/news';
import { NewsService } from 'src/app/admin/news/news.service';
import { UserNewsService } from 'src/app/admin/news/user-news.service';
import { ErrorAware } from 'src/app/util/error/error-aware';


@Component({
	selector: 'tch-news-detail',
	standalone: false,
	templateUrl: './news-detail.component.html'
})
export class NewsDetailComponent extends ErrorAware implements OnInit {
	news: News = { id: 0, subject: '', text: '', url: '', createdAt: 0 };

	constructor(
		private route: ActivatedRoute,
		private newsService: NewsService,
		private userNewsService: UserNewsService) {
		super();
	}

	ngOnInit(): void {
		const id = this.route.snapshot.params.id;
		this.newsService.getOne(Number(id)).subscribe({
			next: (data) => {
				this.news = data;
				this.userNewsService.acknowledge(this.news.id).subscribe();
			},
			error: (error) => this.setError(error)
		});
	}
}
