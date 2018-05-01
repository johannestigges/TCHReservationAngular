import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';

@Component({
  selector: 'user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})
export class UserTableComponent {

  users: User[];
  error;

  constructor(private userService: UserService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.userService.getAll().subscribe(
      data => {
        this.users = data;
      },
      err => {
        this.setError(err);
      },
      () => {
        console.log('finished get all user');
      }
    );
  }

  setError(error) {
    this.error = JSON.stringify(error);
    console.log(this.error);
  }
}
