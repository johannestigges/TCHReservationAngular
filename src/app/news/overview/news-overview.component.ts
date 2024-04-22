import { Component, OnInit } from '@angular/core';
import { News } from 'src/app/admin/news/news';
import { NewsService } from 'src/app/admin/news/news.service';
import { UserNews } from 'src/app/admin/news/usernews';
import { ErrorAware } from 'src/app/util/error/error-aware';

@Component({
	selector: 'tch-news-overview',
	standalone: false,
	templateUrl: './news-overview.component.html',
	styleUrl: './news-overview.component.scss'
})
export class NewsOverviewComponent extends ErrorAware implements OnInit {

	news: AcknoledgedNews[] = [];

	constructor(private newsService: NewsService) {
		super();
	}

	ngOnInit(): void {
		this.newsService.getAll().subscribe({
			next: (data) => {
				this.news = data.map(n => new AcknoledgedNews(n.id, n.subject, n.url, n.text, false));
				this.newsService.getUserNews().subscribe({
					next: (data) => this.addAcknowledges(data),
					error: () => this.news.forEach(n => n.acknowledged = true)
				});
			},
			error: (error) => this.setError(error)
		});
	}
	addAcknowledges(userNews: UserNews[]): void {
		console.log('news:', this.news);
		console.log('user news:', userNews);
		 this.news.forEach(n => n.acknowledged = userNews.find(u => u.newsId === n.id)?.acknowledged ?? false);
	}
}

class AcknoledgedNews {
	constructor(
		public id: number,
		public subject: string,
		public url: string,
		public text: string,
		public acknowledged: boolean
	) { }
}
