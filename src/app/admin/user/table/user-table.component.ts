import {Component, OnInit} from '@angular/core';

import {UserService} from '../user.service';
import {User} from '../user';
import {ErrorAware} from '../../../util/error/error-aware';
import {Router, RouterLink} from '@angular/router';

import {ShowErrorComponent} from "../../../util/show-error/show-error.component";

@Component({
  selector: 'tch-user-table',
  templateUrl: './user-table.component.html',
  imports: [RouterLink, ShowErrorComponent],
  providers: [UserService]

})
export class UserTableComponent extends ErrorAware implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.userService.getAll().subscribe({
      next: (data) => this.users = data,
      error: (error) => this.httpError = error
    });
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
