import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { UserService } from '../user/user.service';

@Component({
  selector: 'tch-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  userid: string;
  password: string;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private userService: UserService) { }

  setError(error: any) {
    this.error = JSON.stringify(error);
    console.log(this.error);
  }

  onClick() {
    this.error = '';
    this.userService.login(this.userid, this.password).subscribe(
      data => {
        this.cancel();
      },
      error => {
        const url = error.urls;
        console.log(error);
        console.log('url: ' + url);
        if (url.search('http') >= 0 && url.search('login?error') === -1) {
          this.cancel();
        } else {
          this.setError('ungültige Anmeldung!');
        }
      },
      () => {
        console.log('finished login.');
      }
    );
  }

  cancel() {
    this.location.back();
  }
}
