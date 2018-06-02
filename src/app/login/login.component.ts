import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { UserService } from '../user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userid;
  password;
  error;

  constructor(private route: ActivatedRoute, private router: Router,
    private userService: UserService) { }

  ngOnInit() {
  }


  setError(error) {
    this.error = JSON.stringify(error);
    console.log(this.error);
  }

  onClick() {
    this.error = '';
    this.userService.login(this.userid, this.password).subscribe(
      data => {
        this.router.navigate(['/']);
      },
      error => {
        const url = error['url'];
        console.log(error);
        console.log("url: " + url);
        if (url.search('http') >= 0 && url.search('login?error') == -1) {
            this.router.navigate(['/table/1']);
        } else {
          this.setError("ungültige Anmeldung!");
        }
      },
      () => {
        console.log('finished login.');
      }
    );
  }

  onBack() {
    this.router.navigate(["/"]);
  }
}
