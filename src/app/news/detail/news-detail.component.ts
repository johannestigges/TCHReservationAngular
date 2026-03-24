import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {News} from 'src/app/admin/news/news';
import {NewsService} from 'src/app/admin/news/news.service';
import {UserNewsService} from 'src/app/admin/news/user-news.service';
import {ErrorAware} from 'src/app/util/error/error-aware';
import {User} from "../../admin/user/user";
import {UserService} from "../../admin/user/user.service";
import {UserRole, userRoleFrom} from "../../admin/user/user-role.enum";
import {filter, Subject, switchMap, takeUntil} from 'rxjs';

@Component({
  selector: 'tch-news-detail',
  templateUrl: './news-detail.component.html',
  imports: [RouterLink]
})
export class NewsDetailComponent extends ErrorAware implements OnInit, OnDestroy {
  news: News = {subject: '', text: '', url: '', createdAt: 0};
  user = User.EMPTY;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private userService: UserService,
    private userNewsService: UserNewsService) {
    super();
  }

  ngOnInit(): void {
    const newsId = Number(this.route.snapshot.params.id);

    this.newsService.getOne(newsId).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (news) => this.news = news,
      error: (error) => this.setError(error)
    });

    this.userService.getLoggedInUser().pipe(
      filter(user => userRoleFrom(user.role) !== UserRole.ANONYMOUS),
      switchMap(() => this.userNewsService.acknowledge(newsId)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
