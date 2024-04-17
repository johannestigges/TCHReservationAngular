import { Component } from '@angular/core';
import { News } from '../news';
import { NewsService } from '../news.service';
import { ErrorAware } from 'src/app/util/error/error-aware';
import { Location } from '@angular/common';
import { DateUtil } from 'src/app/util/date/date-util';

@Component({
  selector: 'tch-news-add',
  standalone: false,
  templateUrl: './news-add.component.html',
  styleUrl: './news-add.component.scss'
})
export class NewsAddComponent extends ErrorAware {

  news: News;

  constructor(private location: Location, private newsService: NewsService) {
    super();

    this.news = { id: 0, subject: '', text: '', url: '', createdAt: 0 };
  }

  onClick() {
    this.clearError();
    this.news.createdAt = DateUtil.now();
    
    this.newsService.add(this.news).subscribe({
      next: (data) => {
        this.news = data;
        this.cancel();
      },
      error: (error) => this.setError(error)
    });
  }

  cancel() {
    this.location.back();
  }
}
