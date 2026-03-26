import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErrorAware} from 'src/app/util/error/error-aware';
import {NewsService} from '../news.service';
import {News} from '../news';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldErrorComponent} from "../../../util/field-error/field-error.component";
import {ShowErrorComponent} from "../../../util/show-error/show-error.component";
import {FormsModule} from "@angular/forms";
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'tch-news-modify',
  templateUrl: './news-modify.component.html',
  imports: [FieldErrorComponent, ShowErrorComponent, FormsModule]
})
export class NewsModifyComponent extends ErrorAware implements OnInit, OnDestroy {

  news: News = {id: 0, subject: '', text: '', url: '', createdAt: 0};

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private router: Router) {
    super();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.newsService.getOne(Number(id)).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.news = data,
      error: (error) => this.setError(error)
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClick() {
    this.clearError();

    if (this.news.id) {
      this.newsService.update(this.news).pipe(takeUntil(this.destroy$)).subscribe({
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
