import {Component, OnInit} from '@angular/core';
import {User} from '../user';
import {UserRole} from '../user-role.enum';
import {ActivationStatus} from '../activation-status.enum';
import {UserService} from '../user.service';
import {ErrorAware} from 'src/app/util/error/error-aware';
import {Router} from '@angular/router';
import {QRCodeComponent} from "angularx-qrcode";

import {ShowErrorComponent} from "../../../util/show-error/show-error.component";
import {FormsModule} from "@angular/forms";
import {SelectFilterComponent} from "../../../util/select-filter/select-filter.component";

@Component({
  selector: 'tch-qr',
  templateUrl: './qr.component.html',
  imports: [QRCodeComponent, FormsModule, SelectFilterComponent, ShowErrorComponent],
  providers: [UserService]
})
export class QrComponent extends ErrorAware implements OnInit {
  users: User[] = [];
  activeUsers: User[] = [];
  activeUserNames: string[] = [];
  user: User;
  selectedUserId = 0;
  qrUrl = '';
  UserRole = UserRole;

  constructor(private readonly router: Router, private readonly userService: UserService) {
    super();
    this.user = new User(null, '', UserRole.REGISTERED, '', this.generatePassword(), ActivationStatus.ACTIVE);
  }

  ngOnInit() {
    this.userService.getAll().subscribe(users => {
      this.user.role = UserRole.REGISTERED;
      this.users = users;
      this.activeUsers = this.users.filter(user => this.isActive(user.status));
      this.activeUserNames = this.activeUsers.map(user => user.name);
    });
  }


  private isActive(status: unknown) {
    return 'ACTIVE' === status;
  }

  onSelectUser(name: string) {
    this.selectedUserId = this.activeUsers?.find(user => user?.name === name)?.id || 0;
  }

  onClickNewUser() {
    if (this.user.name) {
      this.clearError();
      if (this.users.find(user => this.user.name === user.name)) {
        this.addErrorMessage('Den Benutzer gibt es bereits.');
        this.qrUrl = '';
        return;
      }
      this.userService.addUser(this.user).subscribe({
        next: () => this.qrUrl = this.generateUrl(),
        error: (error) => this.setError(error)
      });
    } else {
      this.qrUrl = '';
    }
  }

  onClickNewPassword() {
    if (this.selectedUserId) {
      this.clearError();
      this.userService.getUser(this.selectedUserId).subscribe({
        next: (user) => {
          user.password = this.generatePassword();
          this.userService.updateUser(user).subscribe({
            next: () => {
              this.user = user;
              this.qrUrl = this.generateUrl();
            },
            error: (error) => this.setError(error)
          });
        },
        error: (error) => this.setError(error)
      });
    }
  }

  onClose() {
    this.router.navigateByUrl('/admin?tab=user');
  }

  onCopyToClipboard(text:string){
    navigator.clipboard.writeText(text).then().catch(e => console.error(e));
  }

  private generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 20;
    const buffer = new Uint8Array(length);
    crypto.getRandomValues(buffer);
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars[buffer[i] % chars.length];
    }
    return password;
  }

  private generateUrl() {
    return `${window.location.origin}/#/login?username=${this.user.name}&password=${this.user.password}`;
  }
}
