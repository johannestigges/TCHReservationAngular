import {Component, OnDestroy, OnInit} from '@angular/core';
import {News} from '../news';
import {DateUtil} from 'src/app/util/date/date-util';
import {NewsService} from '../news.service';
import {ErrorAware} from 'src/app/util/error/error-aware';
import {Router, RouterLink} from '@angular/router';

import {ShowErrorComponent} from "../../../util/show-error/show-error.component";
import {Subject, takeUntil} from 'rxjs';


@Component({
  selector: 'tch-news-admin-overview',
  templateUrl: './news-admin-overview.component.html',
  imports: [RouterLink, ShowErrorComponent]
})
export class NewsAdminOverviewComponent extends ErrorAware implements OnInit, OnDestroy {
  newsList: News[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(private newsService: NewsService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.newsService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.newsList = data,
      error: (error) => this.setError(error)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDelete(id: number) {
    this.newsService.delete(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.ngOnInit(),
      error: (error) => this.setError(error)
    });
  }

  cancel() {
    this.router.navigateByUrl('/');
  }

  date(t: number) {
    return DateUtil.showDateTime(t);
  }
}
