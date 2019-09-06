import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { ErrorAware } from '../../error/error-aware';

@Component({
  selector: 'tch-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent extends ErrorAware implements OnInit {

  users: User[];

  constructor(private userService: UserService, private location: Location) {
    super();
  }

  ngOnInit() {
    this.userService.getAll().subscribe(
      data => {
        this.users = data;
      },
      err => {
        this.httpError = err;
      },
      () => { }
    );
  }

  cancel() {
    this.location.back();
  }
}
