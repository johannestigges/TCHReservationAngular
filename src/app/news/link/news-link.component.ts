import { Component } from '@angular/core';
import { NewsService } from 'src/app/admin/news/news.service';

@Component({
  selector: 'tch-news-link',
  standalone: false,
  templateUrl: './news-link.component.html',
  styleUrl: './news-link.component.scss'
})
export class NewsLinkComponent {
	
  hasUnacknowledgedNews = false;

	constructor(private newsService: NewsService) { }

	ngOnInit(): void {
		this.newsService.getUserNews().subscribe(
			news => this.hasUnacknowledgedNews = news.some(n => n.acknowledged === false)
		);
	}
}
