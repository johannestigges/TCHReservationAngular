import {Component, OnInit} from '@angular/core';
import {UserService} from '../admin/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'tch-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  error = '';

  form = this.fb.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  constructor(
    private userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const username  = params.get('username');
      const password = params.get('password');
      if (username && password) {
        this.userService.login(username, password, true).subscribe({
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
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.value;
    this.userService.login(value.user!, value.password!, value.rememberMe!).subscribe({
      next: () => this.onCancel(),
      error: (error) => this.error = error.status === 401
        ? 'ungültige Anmeldedaten'
        : 'Fehler bei der Anmeldung'
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
