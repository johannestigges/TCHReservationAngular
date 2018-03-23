import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { OccupationService } from '../occupation.service';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { Occupation } from '../occupation';
import { OccupationType } from '../occupationtype';
import { OccupationSystemConfig } from '../occupation-system-config';


@Component({
  selector: 'occupation-modify',
  templateUrl: './occupation-modify.component.html',
  styleUrls: ['./occupation-modify.component.css']
})
export class OccupationModifyComponent {

  user: User;
  systemConfig: OccupationSystemConfig;
  occupation: Occupation;

  constructor(private route: ActivatedRoute, private router: Router, private location: Location,
    private service: OccupationService, private userService: UserService) {
  }

  ngOnInit() {
    this.user = this.userService.getUser(this.route.snapshot.params['user']);
    this.systemConfig = this.service.getSystemConfig(this.route.snapshot.params['system']);
    this.service.getOccupation(this.route.snapshot.params['reservation']).subscribe(o => this.occupation = o);

  }

  onDelete() {
    this.service.delete(this.occupation.id);
    this.onBack();
  }

  onBack() {
    this.router.navigate(["/table", this.systemConfig.id, this.user.id, this.occupation.start.getTime()]);
  }
}
