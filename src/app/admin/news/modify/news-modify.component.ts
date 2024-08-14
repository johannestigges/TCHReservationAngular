import { Component, OnInit } from '@angular/core';
import { ErrorAware } from 'src/app/util/error/error-aware';
import { NewsService } from '../news.service';
import { News } from '../news';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'tch-news-modify',
	standalone: false,
	templateUrl: './news-modify.component.html',
	styleUrl: './news-modify.component.scss'
})
export class NewsModifyComponent extends ErrorAware implements OnInit {

	news: News = { id: 0, subject: '', text: '', url: '', createdAt: 0 };

	constructor(
		private route: ActivatedRoute,
		private newsService: NewsService,
		private router: Router) {
		super();
	}

	ngOnInit(): void {
		const id = this.route.snapshot.params.id;
		this.newsService.getOne(Number(id)).subscribe({
			next: (data) => this.news = data,
			error: (error) => this.setError(error)
		});
	}

	onClick() {
		this.clearError();

		if (this.news.id) {
			this.newsService.update(this.news).subscribe({
				next: (data) => {
					this.news = data;
					this.cancel();
				},
				error: (error) => this.setError(error)
			});
		}
	}

	cancel() {
		this.router.navigateByUrl('admin?tab=news');
	}
}
