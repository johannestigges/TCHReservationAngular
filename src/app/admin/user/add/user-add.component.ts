import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { UserService } from '../user.service';
import { User } from '../user';
import { UserRole, userRoleValues } from '../user-role.enum';
import { ActivationStatus, activationStatusValues } from '../activation-status.enum';
import { ErrorAware } from '../../../util/error/error-aware';

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
		private location: Location,
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
			this.errorMessages.push('"Passwörter stimmen nicht überein!');
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
		this.location.back();
	}
}
