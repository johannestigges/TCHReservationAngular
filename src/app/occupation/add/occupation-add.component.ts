import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

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

  repeat: Date;
  time: number;
  type: string;
  types: string[];

  showType: boolean;
  showText: boolean;
  showDuration: boolean;
  showRepeat: boolean;
  focus: string;

  constructor(private route: ActivatedRoute, private router: Router, private location: Location,
    private service: OccupationService, private userService: UserService) {
  }

  ngOnInit() {
    this.systemConfig = this.service.getSystemConfig(this.route.snapshot.params['system']);
    this.user = this.userService.getUser(this.route.snapshot.params['user']);

    // create option list of occupation types
    this.types = Object.keys(OccupationType).map(key => OccupationType[key])
      .filter(value => typeof value === 'string');

    // set default values

    this.occupation = new Occupation(
      new Date(parseInt(this.route.snapshot.params['date'])), // occupation start
      2,                                                      // duration default
      OccupationType.Quickbuchung,                            // default type
      this.user.name,                                         // default text
      this.user.id,                                           // user id
      this.route.snapshot.params['court']                     // court
    );

    this.time = DateUtil.copyTime(new Date(), this.occupation.start).getTime();
    this.type = OccupationType[this.occupation.occupationType];

    // decide which parts of the layout are visible
    // this depends on the user role
    this.showType = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    this.showText = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER, UserRole.KIOSK);
    this.showDuration = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    this.showRepeat = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) this.focus = "date";
    if (this.user.hasRole(UserRole.REGISTERED)) this.focus = "duration";
    if (this.user.hasRole(UserRole.KIOSK)) this.focus = "text";
  }

  duration(d) {
    return new Date(d).toLocaleTimeString();
  }

  onDurationChanged(duration) {
    this.occupation.duration = duration;
  }

  getTimes() {
    let times = [];
    for (let hour = this.systemConfig.openingHour; hour < this.systemConfig.closingHour; hour++) {
      for (let minute = 0; minute < 60; minute += this.systemConfig.durationUnit) {
        times.push(DateUtil.of(hour, minute).getTime());
      }
    }
    return times;
  }

  onClick() {
    this.occupation.occupationType = OccupationType[this.type];
    this.occupation.start = DateUtil.copyTime(this.occupation.start, DateUtil.ofMillies(this.time));

    this.service.addOccupation(this.occupation);
    this.onBack();
  }

  onBack() {
    this.router.navigate(["/table", this.systemConfig.id, this.user.id, this.occupation.start.getTime()]);
  }
}
