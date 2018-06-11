import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { User } from '../user';
import { UserRole } from '../user-role.enum';
import { ActivationStatus } from '../activation-status.enum';
import { ErrorAware } from '../../error/error-aware';

@Component({
  selector: 'user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent extends ErrorAware {

  role_values: string[];
  status_values: string[];
  user_role: string;
  user_status: string;
  user: User;
  confirmPassword: string;

  constructor(private route: ActivatedRoute, private router: Router,
    private userService: UserService) {
      super();
  }

  ngOnInit() {
    this.role_values = Object.keys(UserRole).map(key => UserRole[key])
      .filter(value => typeof value === 'string');
    this.status_values = Object.keys(ActivationStatus).map(key => ActivationStatus[key])
      .filter(value => typeof value === 'string');

    // initialize user with defaults
    this.user = new User(0,"",UserRole.REGISTERED,"","",ActivationStatus.CREATED);
    this.confirmPassword = this.user.password;
    this.user_role = UserRole[UserRole.REGISTERED];
    this.user_status = ActivationStatus[ActivationStatus.CREATED];
  }


  onClick() {
    this.clearError();
    if (this.user.password !== this.confirmPassword) {
      this.errorMessages.push('"Passwörter stimmen nicht überein!');
      return;
    }
    this.user.role = UserRole[this.user_role];
    this.user.status = ActivationStatus[this.user_status];

    this.userService.addUser(this.user).subscribe(
      data => {
        this.user = data;
        this.onBack();
      },
      err => {
        this.httpError = err;
      },
      () => { this.onBack(); }
    );
  }

  onBack() {
    this.router.navigate(["/user"]);
  }
}
