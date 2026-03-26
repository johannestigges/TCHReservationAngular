import {Component, OnDestroy} from '@angular/core';
import {News} from '../news';
import {NewsService} from '../news.service';
import {ErrorAware} from 'src/app/util/error/error-aware';
import {DateUtil} from 'src/app/util/date/date-util';
import {Router} from '@angular/router';
import {FieldErrorComponent} from "../../../util/field-error/field-error.component";
import {FormsModule} from "@angular/forms";
import {ShowErrorComponent} from "../../../util/show-error/show-error.component";
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'tch-news-add',
  templateUrl: './news-add.component.html',
  imports: [FieldErrorComponent, ShowErrorComponent, FormsModule]
})
export class NewsAddComponent extends ErrorAware implements OnDestroy {

  news: News;

  private readonly destroy$ = new Subject<void>();

  constructor(private router: Router, private newsService: NewsService) {
    super();

    this.news = {subject: '', text: '', url: '', createdAt: 0};
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClick() {
    this.clearError();
    this.news.createdAt = DateUtil.now();

    this.newsService.add(this.news).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.news = data;
        this.cancel();
      },
      error: (error) => this.setError(error)
    });
  }

  cancel() {
    this.router.navigateByUrl('admin?tab=news');
  }
}
