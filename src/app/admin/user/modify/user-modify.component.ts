import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole, UserRoleType, userRoleValues } from '../user-role.enum';
import { ActivationStatus, activationStatusValues } from '../activation-status.enum';
import { ErrorAware } from '../../../util/error/error-aware';


@Component({
	selector: 'tch-user-modify',
	templateUrl: './user-modify.component.html',
	styleUrls: ['./user-modify.component.scss']
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
		const id = this.route.snapshot.params.user;
		this.userService.getUser(id).subscribe({
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
			this.addErrorMessage('Passwörter stimmen nicht überein!', 'password');
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
		this.router.navigateByUrl('/admin?tab=user');
	}
}
