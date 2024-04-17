import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { News } from '../news';
import { ErrorAware } from 'src/app/util/error/error-aware';
import { NewsService } from '../news.service';
import { DateUtil } from 'src/app/util/date/date-util';

@Component({
	selector: 'tch-news-overview',
	standalone: false,
	templateUrl: './news-overview.component.html',
	styleUrl: './news-overview.component.scss'
})
export class NewsOverviewComponent extends ErrorAware implements OnInit {

	newsList: News[] = [];

	constructor(private newsService: NewsService, private location: Location) {
		super();
	}

	ngOnInit(): void {
		this.newsService.getAll().subscribe({
			next: (data) => this.newsList = data,
			error: (error) => this.setError(error)
		});
	}

	onDelete(id: number) {
		this.newsService.delete(id).subscribe({
			next: () => this.ngOnInit(),
			error: (error) => this.setError(error)
		});
	}

	cancel() {
		this.location.back();
	}

	date(t: number) {
		return DateUtil.showDateTime(t);
	}
}
