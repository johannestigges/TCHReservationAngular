import { Component } from '@angular/core';

import { UserService } from '../user.service';
import { User } from '../user';
import { UserRole, userRoleValues } from '../user-role.enum';
import { ActivationStatus, activationStatusValues } from '../activation-status.enum';
import { ErrorAware } from '../../../util/error/error-aware';
import { Router } from '@angular/router';

@Component({
	selector: 'tch-user-add',
	templateUrl: './user-add.component.html',
	styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent extends ErrorAware {

	roleValues = userRoleValues;
	statusValues = activationStatusValues;

	user: User;
	userRole = UserRole.ANONYMOUS;
	userStatus = ActivationStatus.CREATED;
	confirmPassword = '';

	constructor(
		private router:Router,
		private userService: UserService) {
		super();

		// initialize user with defaults
		this.user = new User(-1, '', UserRole.REGISTERED, '', '', ActivationStatus.CREATED);
		this.confirmPassword = this.user.password;
		this.userRole = UserRole.REGISTERED;
		this.userStatus = ActivationStatus.CREATED;
	}

	onClick() {
		this.clearError();
		if (this.user.password !== this.confirmPassword) {
			this.addErrorMessage('Passwörter stimmen nicht überein!','password');
			return;
		}
		this.user.role = this.userRole;
		this.user.status = this.userStatus;

		this.userService.addUser(this.user).subscribe({
			next: (data) => {
				this.user = data;
				this.cancel();
			},
			error: (error) => this.setError(error)
		});
	}

	cancel() {
		this.router.navigateByUrl('/admin?tab=user');
		//this.router.navigate(['/admin'], {queryParams: { tab: 'user'}});
	}
}
