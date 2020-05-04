import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ReservationType } from '../reservationtype';
import { ReservationService } from '../reservation.service';
import { ReservationSystemConfig } from '../reservation-system-config';
import { Reservation } from '../reservation';
import { ErrorAware } from '../../error/error-aware';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole } from '../../user/user-role.enum';
import { DateUtil } from '../../date/date-util';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'tch-reservation-add',
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.css']
})
export class ReservationAddComponent extends ErrorAware implements OnInit {

  systemConfig: ReservationSystemConfig;
  user: User;
  reservation: Reservation;

  repeat: number;
  time: number;
  type: string;

  types: string[];

  showType: boolean;
  showText: boolean;
  showDuration: boolean;
  showRepeat: boolean;
  focus: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ReservationService,
    private userService: UserService,
    private cookieService: CookieService) {
    super();
  }

  ngOnInit() {
    this.systemConfig = this.service.getSystemConfig(this.route.snapshot.params.system);
    this.showType = false;
    this.showText = false;
    this.showDuration = false;
    this.showRepeat = false;
    this.focus = 'date';

    this.user = new User(0, '', UserRole.ANONYMOUS);
    this.userService.getLoggedInUser().subscribe(
      data => {
        this.user = new User(data.id, data.name, UserRole['' + data.role]);
        this.reservation.user = this.user;

        // decide which parts of the layout are visible
        // this depends on the user role
        this.showType = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
        this.showText = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER, UserRole.KIOSK, UserRole.TECHNICAL);
        this.showDuration = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
        this.showRepeat = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
        if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) { this.focus = 'date'; }
        if (this.user.hasRole(UserRole.TRAINER)) { this.focus = 'duration'; }
        if (this.user.hasRole(UserRole.REGISTERED)) { this.focus = 'duration'; }
        if (this.user.hasRole(UserRole.KIOSK, UserRole.TECHNICAL)) { this.focus = 'text'; }

        if (this.user.hasRole(UserRole.TRAINER)) {
          this.type = ReservationType[ReservationType.Training];
          this.reservation.text = this.user.name;
        }
      },
      err => {
        this.httpError = err;
      },
    );

    // create option list of occupation types
    this.types = Object.keys(ReservationType).map(key => ReservationType[key])
      .filter(value => typeof value === 'string');

    // set default values
    const start = parseInt(this.route.snapshot.params.date, 10);

    this.reservation = new Reservation(
      this.systemConfig.id,
      this.user,                              // user
      this.user.name,                         // text = user name
      DateUtil.getDatePart(start),            // reservation Date
      DateUtil.getTimePart(start),            // reservation start
      2,                                      // duration default
      this.route.snapshot.params.court,    // court
      ReservationType.Quickbuchung,           // default type
    );
    if (this.cookieService.check('reservationtext')) {
      this.reservation.text = this.cookieService.get('reservationtext');
    }
    this.time = this.reservation.start;
    this.type = ReservationType[this.reservation.type];
  }

  getDate() {
    return DateUtil.toDate(this.reservation.date).toLocaleDateString();
  }

  duration(d) {
    return new Date(d).toLocaleTimeString();
  }

  onDurationChanged(duration) {
    this.reservation.duration = duration;
  }

  getTimes() {
    const times = [];
    for (let hour = this.systemConfig.openingHour; hour < this.systemConfig.closingHour; hour++) {
      for (let minute = 0; minute < 60; minute += this.systemConfig.durationUnitInMinutes) {
        times.push((hour * 60 + minute) * DateUtil.MINUTE);
      }
    }
    return times;
  }



  onClick() {
    this.clearError();
    this.reservation.type = ReservationType[this.type];
    this.reservation.start = this.time;
    this.cookieService.set('reservationtext', this.reservation.text, 30);
    this.service.addReservation(this.reservation)
      .subscribe(
        data => {
          this.reservation = data;
          this.onBack();
        },
        err => {
          this.httpError = err;
        },
        () => { this.onBack(); }
      );
  }

  onBack() {
    this.router.navigate(['/table', this.systemConfig.id, this.reservation.date]);
  }
}
