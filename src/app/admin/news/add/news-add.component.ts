import {Component} from '@angular/core';
import {News} from '../news';
import {NewsService} from '../news.service';
import {ErrorAware} from 'src/app/util/error/error-aware';
import {DateUtil} from 'src/app/util/date/date-util';
import {Router} from '@angular/router';
import {FieldErrorComponent} from "../../../util/field-error/field-error.component";
import {FormsModule} from "@angular/forms";
import {ShowErrorComponent} from "../../../util/show-error/show-error.component";

@Component({
  selector: 'tch-news-add',
  templateUrl: './news-add.component.html',
  imports: [FieldErrorComponent, ShowErrorComponent, FormsModule],
  providers: [NewsService]
})
export class NewsAddComponent extends ErrorAware {

  news: News;

  constructor(private router: Router, private newsService: NewsService) {
    super();

    this.news = {id: 0, subject: '', text: '', url: '', createdAt: 0};
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
    this.router.navigateByUrl('admin?tab=news');
  }
}
