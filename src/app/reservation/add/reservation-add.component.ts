import { Component, OnInit } from '@angular/core';
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
  spieler1: string;
  spieler2: string;
  spieler3: string;
  spieler4: string;

  types: string[];

  showType: boolean;
  showText: boolean;
  showDuration: boolean;
  showRepeat: boolean;
  showDouble: boolean;
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
    const systemId = this.route.snapshot.params.system;
    const start = parseInt(this.route.snapshot.params.date, 10);
    const court = this.route.snapshot.params.court;

    this.showType = false;
    this.showText = false;
    this.showDuration = false;
    this.showRepeat = false;
    this.focus = 'date';
    this.user = new User(0, '', UserRole.ANONYMOUS);
    this.reservation = new Reservation(
      0,                              // Reservarion System Config Id
      this.user,                      // user
      this.user.name,                 // text = user name
      DateUtil.getDatePart(start),    // reservation Date
      DateUtil.getTimePart(start),    // reservation start
      2,                              // duration default
      court,                          // court
      ReservationType.Quickbuchung,   // default type
    );


    // create option list of occupation types
    this.types = Object.keys(ReservationType).map(key => ReservationType[key])
      .filter(value => typeof value === 'string');

    this.service.getSystemConfig(systemId).subscribe(
      config => {
        this.systemConfig = ReservationSystemConfig.of(config);
        this.reservation.systemConfigId = this.systemConfig.id;
        this.userService.getLoggedInUser().subscribe(
          user => {
            this.user = new User(user.id, user.name, UserRole['' + user.role]);
            this.reservation.user = this.user;
            this.init(start);
          },
          usererror => this.httpError = usererror
        );
      },
      configerror => this.httpError = configerror
    );
  }

  private init(start: number) {
    // decide which parts of the layout are visible
    // this depends on the user role
    this.showType = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    this.showText = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    this.showDuration = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    this.showRepeat = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) { this.focus = 'date'; }
    if (this.user.hasRole(UserRole.TRAINER)) { this.focus = 'duration'; }
    if (this.user.hasRole(UserRole.REGISTERED)) { this.focus = 'duration'; }
    if (this.user.hasRole(UserRole.KIOSK, UserRole.TECHNICAL)) { this.focus = 'text'; }

    if (this.showText) {
      if (this.cookieService.check('text')) {
        this.reservation.text = this.cookieService.get('text');
      }
    } else {
      if (this.cookieService.check('spieler1')) {
        this.spieler1 = this.cookieService.get('spieler1');
      }
      if (this.cookieService.check('spieler2')) {
        this.spieler2 = this.cookieService.get('spieler2');
      }
      if (this.cookieService.check('spieler3')) {
        this.spieler3 = this.cookieService.get('spieler3');
      }
      if (this.cookieService.check('spieler4')) {
        this.spieler4 = this.cookieService.get('spieler4');
      }
    }
    if (this.user.hasRole(UserRole.TRAINER)) {
      this.type = ReservationType[ReservationType.Training];
      this.reservation.text = this.user.name;
    }

    this.time = this.reservation.start;
    this.type = ReservationType[this.reservation.type];
  }

  getDate() {
    return DateUtil.toDate(this.reservation.date).toLocaleDateString();
  }

  duration(d: number) {
    return new Date(d).toLocaleTimeString();
  }

  onDurationChanged(duration: number) {
    this.reservation.duration = duration;
    this.showDouble = duration === 3;
  }

  getTimes() {
    const times = [];
    for (let hour = this.systemConfig.openingHour; hour < this.systemConfig.closingHour; hour++) {
      for (let minute = 0; minute < 60; minute += this.systemConfig.durationUnitInMinutes) {
        times.push((hour * 60 + minute) * DateUtil.MINUTE);
      }
    }
    console.log(times);
    return times;
  }

  onClick() {
    this.clearError();
    this.reservation.type = ReservationType[this.type];
    this.reservation.start = this.time;
    if (!this.showText) {
      this.cookieService.set('spieler1', this.spieler1, 30);
      this.cookieService.set('spieler2', this.spieler2, 30);
      if (this.showDouble) {
        this.reservation.text = `${this.spieler1} ${this.spieler2} ${this.spieler3} ${this.spieler4}`;
        this.cookieService.set('spieler3', this.spieler3, 30);
        this.cookieService.set('spieler4', this.spieler4, 30);
      } else {
        this.reservation.text = `${this.spieler1} ${this.spieler2}`;
      }
    } else {
      this.cookieService.set('text', this.reservation.text, 30);
    }
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
