import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole } from '../user-role.enum';
import { ActivationStatus } from '../activation-status.enum';
import { ErrorAware } from '../../../util/error/error-aware';


@Component({
	selector: 'tch-user-modify',
	templateUrl: './user-modify.component.html',
	styleUrls: ['./user-modify.component.scss']
})
export class UserModifyComponent extends ErrorAware implements OnInit {

	roleValues: string[];
	statusValues: string[];

	user: User;
	userRole: string;
	userStatus: string;
	confirmPassword: string;

	loggedinUser: User;
	isAdmin = false;

	constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private location: Location) {
		super();
	}

	ngOnInit() {
		this.roleValues = Object.keys(UserRole).map(key => UserRole[key])
			.filter(value => typeof value === 'string');
		this.statusValues = Object.keys(ActivationStatus).map(key => ActivationStatus[key])
			.filter(value => typeof value === 'string');

		const id = this.route.snapshot.params.user;
		this.userService.getUser(id).subscribe({
			next: (user) => {
				this.user = user;
				this.confirmPassword = this.user.password;
				this.userRole = '' + this.user.role;
				this.userStatus = '' + this.user.status;
			},
			error: (error) => this.setError(error)
		});

		this.userService.getLoggedInUser().subscribe({
			next: (user) => {
				this.loggedinUser = new User(user.id, user.name, UserRole['' + user.role]);
				this.isAdmin = this.loggedinUser.hasRole(UserRole.ADMIN);
			},
			error: (error) => this.setError(error)
		});
	}

	onClick() {
		this.clearError();
		if (this.user.password !== this.confirmPassword) {
			this.errorMessages.push('Passwörter stimmen nicht überein!');
			return;
		}
		this.user.role = UserRole[this.userRole];
		this.user.status = ActivationStatus[this.userStatus];

		this.userService.updateUser(this.user).subscribe({
			next: () => this.cancel(),
			error: (error) => this.setError(error)
		});
	}

	cancel() {
		this.location.back();
	}
}
