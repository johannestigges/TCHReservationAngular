import {Component, OnInit} from '@angular/core';
import {ErrorAware} from 'src/app/util/error/error-aware';
import {NewsService} from '../news.service';
import {News} from '../news';
import {ActivatedRoute, Router} from '@angular/router';
import {FieldErrorComponent} from "../../../util/field-error/field-error.component";
import {ShowErrorComponent} from "../../../util/show-error/show-error.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'tch-news-modify',
  templateUrl: './news-modify.component.html',
  imports: [FieldErrorComponent, ShowErrorComponent, FormsModule],
  providers: [NewsService]
})
export class NewsModifyComponent extends ErrorAware implements OnInit {

  news: News = {id: 0, subject: '', text: '', url: '', createdAt: 0};

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
