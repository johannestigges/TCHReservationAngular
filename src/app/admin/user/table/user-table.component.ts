import {Component, OnDestroy, OnInit} from '@angular/core';

import {UserService} from '../user.service';
import {User} from '../user';
import {ErrorAware} from '../../../util/error/error-aware';
import {Router, RouterLink} from '@angular/router';

import {ShowErrorComponent} from "../../../util/show-error/show-error.component";
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'tch-user-table',
  templateUrl: './user-table.component.html',
  imports: [RouterLink, ShowErrorComponent]
})
export class UserTableComponent extends ErrorAware implements OnInit, OnDestroy {

  users: User[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.userService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.users = data,
      error: (error) => this.httpError = error
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
