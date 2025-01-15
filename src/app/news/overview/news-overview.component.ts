import {Component, OnInit} from '@angular/core';
import {NewsService} from 'src/app/admin/news/news.service';
import {UserNewsService} from 'src/app/admin/news/user-news.service';
import {UserNews} from 'src/app/admin/news/usernews';
import {ErrorAware} from 'src/app/util/error/error-aware';
import { NgClass } from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'tch-news-overview',
  templateUrl: './news-overview.component.html',
  imports: [NgClass, RouterLink]
})
export class NewsOverviewComponent extends ErrorAware implements OnInit {

  news: AcknoledgedNews[] = [];

  constructor(
    private newsService: NewsService,
    private userNewsServise: UserNewsService) {
    super();
  }

  ngOnInit(): void {
    this.newsService.getAll().subscribe({
      next: (allNews) => {
        this.news = allNews.map(news => new AcknoledgedNews(news.id, news.subject, news.url, news.text, false));
        this.userNewsServise.getUserNews().subscribe({
          next: (data) => this.addAcknowledges(data),
          error: () => this.news.forEach(n => n.acknowledged = true)
        });
      },
      error: (error) => this.setError(error)
    });
  }

  addAcknowledges(userNews: UserNews[]): void {
    this.news.forEach(
      news => news.acknowledged = userNews
        .find(userNews => userNews.newsId === news.id)?.acknowledged ?? false);
  }
}

class AcknoledgedNews {
  constructor(
    public id: number,
    public subject: string,
    public url: string,
    public text: string,
    public acknowledged: boolean
  ) {
  }
}
