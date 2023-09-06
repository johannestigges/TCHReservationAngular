import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { UserService } from '../user.service';
import { User } from '../user';
import { UserRole } from '../user-role.enum';
import { ActivationStatus } from '../activation-status.enum';
import { ErrorAware } from '../../../util/error/error-aware';

@Component({
	selector: 'tch-user-add',
	templateUrl: './user-add.component.html',
	styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent extends ErrorAware implements OnInit {

	roleValues: string[];
	statusValues: string[];

	user: User;
	userRole: string;
	userStatus: string;
	confirmPassword: string;

	constructor(
    private location: Location,
    private userService: UserService) {
		super();
	}

	ngOnInit() {
		this.roleValues = Object.keys(UserRole).map(key => UserRole[key])
			.filter(value => typeof value === 'string');
		this.statusValues = Object.keys(ActivationStatus).map(key => ActivationStatus[key])
			.filter(value => typeof value === 'string');

		// initialize user with defaults
		this.user = new User(0, '', UserRole.REGISTERED, '', '', ActivationStatus.CREATED);
		this.confirmPassword = this.user.password;
		this.userRole = UserRole[UserRole.REGISTERED];
		this.userStatus = ActivationStatus[ActivationStatus.CREATED];
	}

	onClick() {
		this.clearError();
		if (this.user.password !== this.confirmPassword) {
			this.errorMessages.push('"Passwörter stimmen nicht überein!');
			return;
		}
		this.user.role = UserRole[this.userRole];
		this.user.status = ActivationStatus[this.userStatus];

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
