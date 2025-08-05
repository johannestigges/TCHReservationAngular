import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {News} from 'src/app/admin/news/news';
import {NewsService} from 'src/app/admin/news/news.service';
import {UserNewsService} from 'src/app/admin/news/user-news.service';
import {ErrorAware} from 'src/app/util/error/error-aware';
import {User} from "../../admin/user/user";
import {UserService} from "../../admin/user/user.service";
import {UserRole, userRoleFrom} from "../../admin/user/user-role.enum";

@Component({
  selector: 'tch-news-detail',
  templateUrl: './news-detail.component.html',
  imports: [RouterLink],
  providers: [NewsService, UserService, UserNewsService]
})
export class NewsDetailComponent extends ErrorAware implements OnInit {
  news: News = {subject: '', text: '', url: '', createdAt: 0};
  user = User.EMPTY;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
    private userService: UserService,
    private userNewsService: UserNewsService) {
    super();
  }

  ngOnInit(): void {
    const newsId = this.route.snapshot.params.id;
    this.newsService.getOne(Number(newsId)).subscribe({
      next: (news) => {
        this.news = news;
        this.acknoledge(news.id!)
      },
      error: (error) => this.setError(error)
    });
  }

  private acknoledge(newsId: number) {
    this.userService.getLoggedInUser().subscribe(
      user => {
        if (userRoleFrom(user.role) === UserRole.ANONYMOUS) {
          return;
        }
        this.userNewsService.acknowledge(newsId).subscribe();
      }
    );
  }
}
