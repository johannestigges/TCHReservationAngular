import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { OccupationType } from '../occupationtype';
import { OccupationService } from '../occupation.service';
import { OccupationSystemConfig } from '../occupation-system-config';
import { Occupation } from '../occupation';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole } from '../../user/user-role.enum';
import { DateUtil } from '../../date/date-util';

@Component({
  selector: 'occupation-add',
  templateUrl: './occupation-add.component.html',
  styleUrls: ['./occupation-add.component.css']
})
export class OccupationAddComponent {

  systemConfig: OccupationSystemConfig;
  user: User;
  occupation: Occupation;

  repeat:Date;
  time;
  type: string;
  types: string[];

  showType: boolean;
  showText: boolean;
  showDuration: boolean;
  showRepeat: boolean;
  focus: string;

  constructor(private route: ActivatedRoute, private location: Location, private service: OccupationService, private userService: UserService) {
    this.systemConfig = service.getSystemConfig(route.snapshot.params['system']);
    this.user = userService.getUser(route.snapshot.params['user']);

    // create option list of occupation types
    this.types = Object.keys(OccupationType).map(key => OccupationType[key])
      .filter(value => typeof value === 'string');

    // set default values
    this.type = OccupationType[OccupationType.Quickbuchung];

    this.occupation = new Occupation(
      new Date(parseInt(route.snapshot.params['date'])), // occupation start
      2,                                                 // duration default
      OccupationType.Quickbuchung,                       // default type
      this.user.name,                                    // default text
      this.user.id,                                      // user id
      route.snapshot.params['court']                     // court
    );

    // decide which parts of the layout are visible
    // this depend on the user role
    this.showType = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    this.showText = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER, UserRole.KIOSK);
    this.showDuration = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    this.showRepeat = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) this.focus = "date";
    if (this.user.hasRole(UserRole.REGISTERED)) this.focus = "duration";
    if (this.user.hasRole(UserRole.KIOSK)) this.focus = "text";
  }
  
  public onDurationChanged(duration: number) {
    this.occupation.duration = duration;
  }

  onClick() {
    this.occupation.occupationType = OccupationType[this.type];

    this.service.addOccupation(this.occupation);
    this.location.back();
  }

  onBack() {
    this.location.back();
  }
}
