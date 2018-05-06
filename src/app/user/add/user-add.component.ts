import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { User } from '../user';
import { UserRole } from '../user-role.enum';
import { ActivationStatus } from '../activation-status.enum';

@Component({
  selector: 'user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent {

  roles;
  status;
  newUser: User;
  confirmPassword: string;
  error;

  constructor(private route: ActivatedRoute, private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {
    this.newUser = new User(0,"",UserRole.REGISTERED,"","",ActivationStatus.CREATED);
    console.log(this.newUser);
    console.log(this.newUser.email);
    console.log(this.newUser.password);
    this.confirmPassword = this.newUser.password;
    this.roles = Object.keys(UserRole).map(key => UserRole[key])
      .filter(value => typeof value === 'string');
    this.status = Object.keys(ActivationStatus).map(key => ActivationStatus[key])
      .filter(value => typeof value === 'string');
  }

  setError(error) {
    this.error = JSON.stringify(error);
    console.log(this.error);
  }

  onClick() {
    this.error = '';
    if (this.newUser.password !== this.confirmPassword) {
      this.setError("Passwörter stimmen nicht überein!");
      return;
    }

    this.userService.addUser(this.newUser).subscribe(
      data => {
        this.newUser = data;
        this.onBack();
      },
      err => {
        this.setError(err);
      },
      () => { this.onBack(); }
    );
  }

  onBack() {
    this.router.navigate(["/user"]);
  }
}
