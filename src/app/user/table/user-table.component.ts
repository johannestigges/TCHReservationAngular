import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { ErrorAware } from '../../error/error-aware';

@Component({
  selector: 'user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent extends ErrorAware {

  users: User[];

  constructor(private userService: UserService, private route: ActivatedRoute) {
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
      () => {
//        console.log('finished get all user');
      }
    );
  }
}
