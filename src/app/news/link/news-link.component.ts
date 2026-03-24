import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {NewsService} from 'src/app/admin/news/news.service';
import {UserNewsService} from 'src/app/admin/news/user-news.service';
import {User} from 'src/app/admin/user/user';
import {RouterLink} from "@angular/router";
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'tch-news-link',
  templateUrl: './news-link.component.html',
  imports: [RouterLink],
})
export class NewsLinkComponent implements OnInit, OnChanges, OnDestroy {

  @Input() loggedInUser: User = User.EMPTY;

  newsCount = 0;
  hasUnacknowledgedNews = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private newsService: NewsService,
    private userNewsService: UserNewsService) {
  }

  ngOnInit(): void {
    this.newsService.getAll().pipe(takeUntil(this.destroy$)).subscribe(
      news => this.newsCount = news.length
    );
  }

  ngOnChanges(): void {
    this.userNewsService.getUserNews().pipe(takeUntil(this.destroy$)).subscribe(
      userNews => this.hasUnacknowledgedNews = userNews.length < this.newsCount
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
