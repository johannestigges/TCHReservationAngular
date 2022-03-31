import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ReservationType } from '../reservationtype';
import { ReservationService } from '../reservation.service';
import { ReservationSystemConfig } from '../reservation-system-config';
import { Reservation } from '../reservation';
import { ErrorAware } from '../../util/error/error-aware';

import { UserService } from '../../admin/user/user.service';
import { User } from '../../admin/user/user';
import { UserRole } from '../../admin/user/user-role.enum';
import { DateUtil } from '../../util/date/date-util';
import { ActivationStatus } from '../../admin/user/activation-status.enum';

@Component({
  selector: 'tch-reservation-add',
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.scss'],
})
export class ReservationAddComponent extends ErrorAware implements OnInit {
  systemConfig: ReservationSystemConfig;
  user: User;
  reservation: Reservation;

  repeatUntil: Date;
  repeatMinDate: Date;
  time: number;
  type: string;
  player1: string;
  player2: string;
  player3: string;
  player4: string;

  types: string[];

  showType: boolean;
  showText: boolean;
  showSimpleDuration: boolean;
  showDuration: boolean;
  showRepeat: boolean;
  showDouble: boolean;
  focus: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ReservationService,
    private userService: UserService //    private cookieService: CookieService
  ) {
    super();
  }

  ngOnInit() {
    const systemId = this.route.snapshot.params.system;
    const start = parseInt(this.route.snapshot.params.date, 10);
    const court = this.route.snapshot.params.court;

    this.repeatMinDate = DateUtil.addDays(new Date(), 1);

    this.showType = false;
    this.showText = false;
    this.showSimpleDuration = false;
    this.showDuration = false;
    this.showRepeat = false;
    this.focus = 'date';
    this.user = new User(0, '', UserRole.ANONYMOUS);
    this.reservation = new Reservation(
      0, // Reservarion System Config Id
      null, // user
      this.user.name, // text = user name
      DateUtil.getDatePart(start), // reservation Date
      DateUtil.getTimePart(start), // reservation start
      1, // duration default
      court, // court
      ReservationType.Quickbuchung // default type
    );

    // create option list of occupation types
    this.types = Object.keys(ReservationType)
      .map((key) => ReservationType[key])
      .filter((value) => typeof value === 'string');

    this.service.getSystemConfig(systemId).subscribe(
      (config) => {
        this.systemConfig = ReservationSystemConfig.of(config);
        this.reservation.systemConfigId = this.systemConfig.id;
        this.userService.getLoggedInUser().subscribe(
          (user) => {
            this.user = new User(
              user.id,
              user.name,
              UserRole['' + user.role],
              ActivationStatus['' + user.status]
            );
            this.init(start);
          },
          (usererror) => (this.httpError = usererror)
        );
      },
      (configerror) => (this.httpError = configerror)
    );
  }

  onGenerateOccupations() {
    this.clearError();
    this.reservation.occupations = null;
    this.reservation.type = ReservationType[this.type];
    this.reservation.start = this.time;
    this.reservation.repeatUntil = this.repeatUntil.getTime();
    if (!this.showText) {
      if (this.showDouble) {
        this.reservation.text = `${this.player1} ${this.player2} ${this.player3} ${this.player4}`;
      } else {
        this.reservation.text = `${this.player1} ${this.player2}`;
      }
    }
    this.service.checkReservation(this.reservation).subscribe(
      (reservation) => {
        console.log(
          'checked reservation with ',
          reservation.occupations.length,
          ' occupations.'
        );
        this.reservation = reservation;
      },
      (error) => (this.httpError = error)
    );
  }

  onDeleteOccupation(i: number) {
    this.reservation.occupations.splice(i, 1);
  }

  private init(start: number) {
    // decide which parts of the layout are visible
    // this depends on the user role
    this.showType = this._isAtLeastTeamster();
    this.showText = this._isAtLeastTeamster();
    this.showSimpleDuration =
      this.systemConfig.durationUnitInMinutes === 30 &&
      !this._isAtLeastTeamster();
    this.showDuration = !this.showSimpleDuration && this._isAtLeastTeamster();
    this.showRepeat = this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
      this.focus = 'date';
    }
    if (this.user.hasRole(UserRole.TRAINER, UserRole.TEAMSTER)) {
      this.focus = 'duration';
    }
    if (this.user.hasRole(UserRole.REGISTERED)) {
      this.focus = 'duration';
    }
    if (this.user.hasRole(UserRole.KIOSK, UserRole.TECHNICAL)) {
      this.focus = 'text';
    }

    if (this.showText) {
      this.reservation.text = this._getCookie('text');
    } else {
      this.player1 = this._getCookie('player1');
      this.player2 = this._getCookie('player2');
      this.player3 = this._getCookie('player3');
      this.player4 = this._getCookie('player4');
    }
    if (this.user.hasRole(UserRole.TRAINER)) {
      this.reservation.type = ReservationType.Training;
      this.reservation.text = this.user.name;
    }
    if (this.user.hasRole(UserRole.TEAMSTER)) {
      this.reservation.type = ReservationType.Meisterschaft;
      this.reservation.text = this._getCookie('myTeam');
    }
    this.time = this.reservation.start;
    this.reservation.duration = this.systemConfig.getDurationDefault();
    this.type = ReservationType[this.reservation.type];
  }

  getDate() {
    return this.toDate(this.reservation.date);
  }

  toDate(date: number) {
    return DateUtil.toDate(date).toLocaleDateString();
  }

  duration(d: number) {
    return new Date(d).toLocaleTimeString();
  }

  onRepeatTypeChanged($event) {
    this.reservation.occupations = [];
  }

  onDurationChanged(duration: number) {
    this.reservation.duration = duration;
    this.showDouble = duration === 3;
  }

  getTimes() {
    const times = [];
    for (
      let hour = this.systemConfig.openingHour;
      hour < this.systemConfig.closingHour;
      hour++
    ) {
      for (
        let minute = 0;
        minute < 60;
        minute += this.systemConfig.durationUnitInMinutes
      ) {
        times.push((hour * 60 + minute) * DateUtil.MINUTE);
      }
    }
    return times;
  }

  onClick() {
    this.clearError();
    this.reservation.type = ReservationType[this.type];
    this.reservation.start = this.time;
    this.reservation.repeatUntil = this.repeatUntil?.getTime();
    if (!this.showText) {
      this._setCookie('player1', this.player1);
      this._setCookie('player2', this.player2);
      if (this.showDouble) {
        this.reservation.text = `${this.player1} ${this.player2} ${this.player3} ${this.player4}`;
        this._setCookie('player3', this.player3);
        this._setCookie('playerr4', this.player4);
      } else {
        this.reservation.text = `${this.player1} ${this.player2}`;
      }
    } else {
      this._setCookie('text', this.reservation.text);
    }
    this.service.addReservation(this.reservation).subscribe(
      (data) => {
        this.reservation = data;
        if (this.reservation.occupations.length > 1) {
          let msg = `Es wurden ${this.reservation.occupations.length} Platzbelegungen angelegt.`;
          for (const o of this.reservation.occupations) {
            msg += `\n${DateUtil.showDate(o.date)} ${DateUtil.showTime(
              o.start
            )}`;
          }
          alert(msg);
        }
        this.onBack();
      },
      (err) => (this.httpError = err)
    );
  }

  onBack() {
    this.router.navigate([
      '/table',
      this.systemConfig.id,
      this.reservation.date,
    ]);
  }

  private _getCookie(name) {
    return localStorage.getItem(name) || '';
  }

  private _setCookie(name, value) {
    localStorage.setItem(name, value);
  }

  private _isAtLeastTeamster() {
    return this.user.hasRole(
      UserRole.ADMIN,
      UserRole.TRAINER,
      UserRole.TEAMSTER
    );
  }
}
