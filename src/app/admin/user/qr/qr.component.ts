import { Component } from '@angular/core';
import { User } from '../user';
import { UserRole } from '../user-role.enum';
import { ActivationStatus } from '../activation-status.enum';
import { UserService } from '../user.service';
import { ErrorAware } from 'src/app/util/error/error-aware';
import { Location } from '@angular/common';

@Component({
  selector: 'tch-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent extends ErrorAware {

  user: User

  qrUrl = '';

  constructor(private readonly location: Location, private readonly userService: UserService) {
    super();
    this.user = new User(0, '', UserRole.REGISTERED, null, this.createPassword(), ActivationStatus.ACTIVE);
  }


  onClick() {
    if (this.user.name) {
      this.userService.addUser(this.user).subscribe({
        next: () => this.qrUrl =
          `${window.location.origin}/#/login?username=${this.user.name}&password=${this.user.password}`,
        error: (error) => this.setError(error)
      });
    } else {
      this.qrUrl = '';
    };
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
}
