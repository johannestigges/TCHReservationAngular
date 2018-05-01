import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';

@Component({
  selector: 'user-modify',
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.css']
})
export class UserModifyComponent {

  password: string;
  user: User;
  error;

  constructor(private route: ActivatedRoute, private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params['user'];
    this.userService.getUser(id).subscribe(
      data => {
        this.user = data;
        this.password = this.user.password;
      },
      err => {
        this.setError(err);
      },
      () => {
        console.log("finished read user " + id);
      }
    );
  }

  setError(error) {
    this.error = JSON.stringify(error);
    console.log(this.error);
  }

  onClick() {
    this.error = '';
    if (this.user.password !== this.password) {
      this.setError("Passwörter stimmen nicht überein!");
      return;
    }

    this.userService.updateUser(this.user).subscribe(
      data => {
        this.user = data;
        this.onBack();
      },
      err => {
        this.setError(err);
      },
      () => { this.onBack(); }
    );
  }

  onBack() {
    this.router.navigate(["/user"]);
  }
}
