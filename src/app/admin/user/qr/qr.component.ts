import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserRole } from '../user-role.enum';
import { ActivationStatus } from '../activation-status.enum';
import { UserService } from '../user.service';
import { ErrorAware } from 'src/app/util/error/error-aware';
import { Location } from '@angular/common';

@Component({
  selector: 'tch-qr',
  templateUrl: './qr.component.html'
})
export class QrComponent extends ErrorAware implements OnInit {
  users: User[] = [];
  activeUsers: User[] = [];
  user: User
  qrUrl = '';

  constructor(private readonly location: Location, private readonly userService: UserService) {
    super();
    this.user = new User(0, '', UserRole.REGISTERED, null, this.createPassword(), ActivationStatus.ACTIVE);
  }

  ngOnInit() {
      this.userService.getAll().subscribe(users=>{
      this.users=users;
      this.activeUsers = this.users.filter(u => this.isActive(u.status));
      console.log('users', this.users.length, this.activeUsers.length, this.users);
      });
  }

  private isActive(status) {
    return 'ACTIVE' === status.toString();
  }

  onClickNewUser() {
    if (this.user.name) {
      this.clearError();
        if (this.users.find(u => this.user.name === u.name)) {
          this.errorMessages.push("Den Benutzer gibt es bereits.");
          this.qrUrl='';
          return;
        }
        this.userService.addUser(this.user).subscribe({
        next: () => this.qrUrl = this.generateUrl(),
        error: (error) => this.setError(error)
      });
    } else {
      this.qrUrl = '';
    };
  }

  onClickNewPassword() {
  }

  onClose() {
    this.location.back();
  }

  private createPassword() {
    return Array(20)
      .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
      .map(function (x) { return x[Math.floor(Math.random() * x.length)] })
      .join('');
  }
  private generateUrl() {
    return `${window.location.origin}/#/login?username=${this.user.name}&password=${this.user.password}`;
  }
}
