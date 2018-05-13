import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole } from '../user-role.enum';
import { ActivationStatus } from '../activation-status.enum';


@Component({
  selector: 'user-modify',
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.css']
})
export class UserModifyComponent {

  role_values: string[];
  status_values: string[];
  user_role: string;
  user_status: string;
  user: User;
  confirmPassword: string;
  error;

  constructor(private route: ActivatedRoute, private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {

    this.role_values = Object.keys(UserRole).map(key => UserRole[key])
      .filter(value => typeof value === 'string');
    this.status_values = Object.keys(ActivationStatus).map(key => ActivationStatus[key])
      .filter(value => typeof value === 'string');

    const id = this.route.snapshot.params['user'];
    this.userService.getUser(id).subscribe(
      data => {
        this.user = data;
        this.confirmPassword = this.user.password;
        this.user_role = UserRole[this.user.role];
        this.user_status = ActivationStatus[this.user.status];
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
    if (this.user.password !== this.confirmPassword) {
      this.setError("Passwörter stimmen nicht überein!");
      return;
    }
    this.user.role = UserRole[this.user_role];
    this.user.status = ActivationStatus[this.user_status];

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
