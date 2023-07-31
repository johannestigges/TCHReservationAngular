import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../admin/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'tch-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	error: string;

	form = this.fb.group({
		user: ['', Validators.required],
		password: ['', Validators.required]
	});

	constructor(
		private userService: UserService,
		private readonly router: Router,
		private readonly route: ActivatedRoute,
		private readonly fb: FormBuilder
	) { }

	ngOnInit(): void {
		this.route.queryParamMap.subscribe(params => {
			const username: string | null = params.get('username');
			const pw: string | null = params.get('password');
			if (username && pw) {
				this.userService.login(username, pw).subscribe({
					next: () => this.router.navigateByUrl('/'),
					error: (error) => this.setError(error)
				});
			}
			if (params.get('logout')) {
				this.userService.logout().subscribe(
					() => this.onCancel()
				);
			}
		});
	}

	setError(error: unknown) {
		this.error = JSON.stringify(error);
		console.log(this.error);
	}

	onSubmit() {
		if (this.form.valid) {
			this.userService.login(this.form.controls.user.value!, this.form.controls.password.value!)
				.subscribe({
					next: () => this.router.navigate(['/']),
					error: (error) => {
						console.log("error from login service", JSON.stringify(error));
						this.error = error.status === 401
							? 'ungültige Anmeldedaten'
							: 'Fehler bei der Anmeldung'
					}
				});
		}
	}

	onCancel() {
		this.router.navigate(['/']);
	}
}
