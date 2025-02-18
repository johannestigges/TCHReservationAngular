import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {UserService} from '../user.service';
import {User} from '../user';
import {UserRole, UserRoleType, userRoleValues} from '../user-role.enum';
import {ActivationStatus, activationStatusValues} from '../activation-status.enum';
import {ErrorAware} from '../../../util/error/error-aware';

import {FormsModule} from "@angular/forms";
import {FieldErrorComponent} from "../../../util/field-error/field-error.component";
import {ShowErrorComponent} from "../../../util/show-error/show-error.component";


@Component({
  selector: 'tch-user-modify',
  templateUrl: './user-modify.component.html',
  imports: [FieldErrorComponent, ShowErrorComponent, FormsModule],
  providers: [UserService]
})
export class UserModifyComponent extends ErrorAware implements OnInit {

  roleValues = userRoleValues;
  statusValues = activationStatusValues;

  user: User = User.EMPTY;
  userRole = UserRole.ANONYMOUS;
  userStatus = ActivationStatus.CREATED;
  confirmPassword = '';

  loggedinUser = User.EMPTY;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router) {
    super();
  }

  ngOnInit() {
    const userId = this.route.snapshot.params.user;
    this.userService.getUser(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.confirmPassword = this.user.password;
        this.userRole = this.user.role;
        this.userStatus = this.user.status;
      },
      error: (error) => this.setError(error)
    });

    this.userService.getLoggedInUser().subscribe({
      next: (user) => {
        this.loggedinUser = new User(user.id, user.name, UserRole[user.role.toString() as UserRoleType]);
        this.isAdmin = this.loggedinUser.hasRole(UserRole.ADMIN);
      },
      error: (error) => this.setError(error)
    });
  }

  onClick() {
    this.clearError();
    if (this.user.password !== this.confirmPassword) {
      this.addFieldError('confirmPassword', 'Passwörter stimmen nicht überein!');
      return;
    }
    this.user.role = this.userRole;
    this.user.status = this.userStatus;

    this.userService.updateUser(this.user).subscribe({
      next: () => this.cancel(),
      error: (error) => this.setError(error)
    });
  }

  cancel() {
    if (this.isAdmin) {
      this.router.navigateByUrl('/admin?tab=user');
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
