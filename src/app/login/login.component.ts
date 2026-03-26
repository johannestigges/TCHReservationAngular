import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../admin/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'tch-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule]
})
export class LoginComponent implements OnInit, OnDestroy {
  error = '';

  form = this.fb.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  private readonly destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const username  = params.get('username');
      const password = params.get('password');
      if (username && password) {
        this.userService.login(username, password, true)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.router.navigateByUrl('/'),
          error: (error) => this.setError(error)
        });
      }
      if (params.get('logout')) {
        this.userService.logout().pipe(takeUntil(this.destroy$)).subscribe(
          () => this.onCancel()
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setError(error: unknown) {
    this.error = JSON.stringify(error);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const value = this.form.value;
    this.userService.login(value.user!, value.password!, value.rememberMe!).pipe(takeUntil(this.destroy$)).subscribe({
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
