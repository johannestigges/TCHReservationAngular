import {Component, OnDestroy} from '@angular/core';

import {UserService} from '../user.service';
import {User} from '../user';
import {UserRole, userRoleValues} from '../user-role.enum';
import {ActivationStatus, activationStatusValues} from '../activation-status.enum';
import {ErrorAware} from '../../../util/error/error-aware';
import {Router} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {FieldErrorComponent} from "../../../util/field-error/field-error.component";
import {ShowErrorComponent} from "../../../util/show-error/show-error.component";
import {Subject, takeUntil} from 'rxjs';


@Component({
  selector: 'tch-user-add',
  templateUrl: './user-add.component.html',
  imports: [FieldErrorComponent, ShowErrorComponent, FormsModule]
})
export class UserAddComponent extends ErrorAware implements OnDestroy {

  roleValues = userRoleValues;
  statusValues = activationStatusValues;

  user: User;
  userRole = UserRole.ANONYMOUS;
  userStatus = ActivationStatus.CREATED;
  confirmPassword = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private userService: UserService) {
    super();

    // initialize user with defaults
    this.user = new User(null, '', UserRole.REGISTERED, '', '', ActivationStatus.CREATED);
    this.confirmPassword = this.user.password;
    this.userRole = UserRole.REGISTERED;
    this.userStatus = ActivationStatus.CREATED;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClick() {
    this.clearError();
    if (this.user.password !== this.confirmPassword) {
      this.addFieldError('confirmPassword', 'Passwörter stimmen nicht überein!');
      return;
    }
    this.user.role = this.userRole;
    this.user.status = this.userStatus;

    this.userService.addUser(this.user).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.user = data;
        this.cancel();
      },
      error: (error) => this.setError(error)
    });
  }

  cancel() {
    this.router.navigateByUrl('/admin?tab=user');
  }
}
