import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbDatepickerModule, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import {ReservationService} from '../reservation.service';
import {ReservationSystemConfig, SystemConfigReservationType} from '../reservation-system-config';
import {Reservation} from '../reservation';
import {ErrorAware} from '../../util/error/error-aware';

import {UserService} from '../../admin/user/user.service';
import {User} from '../../admin/user/user';
import {UserRole, userRoleFrom} from '../../admin/user/user-role.enum';
import {DateUtil} from '../../util/date/date-util';
import {activationStatusFrom} from '../../admin/user/activation-status.enum';
import {FieldErrorComponent} from "../../util/field-error/field-error.component";
import {ShowErrorComponent} from "../../util/show-error/show-error.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'tch-reservation-add',
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.scss'],
  imports: [FieldErrorComponent, ShowErrorComponent, FormsModule, NgbDatepickerModule],
  providers: [ReservationService, UserService]
})
export class ReservationAddComponent extends ErrorAware implements OnInit {
  systemConfig = ReservationSystemConfig.EMPTY;
  user = User.EMPTY;
  reservation = Reservation.EMPTY;
  reservationTypes: SystemConfigReservationType[] = [];

  repeatUntil?: NgbDateStruct;
  repeatMinDate?: NgbDateStruct;
  time?: number;
  type = -1;

  showSimpleDuration = false;
  showDuration = false;
  showRepeat = false;
  showDouble = false;
  focus = 'date';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ReservationService,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit() {
    const systemId = this.route.snapshot.params.system;
    const start = parseInt(this.route.snapshot.params.date, 10);
    const court = this.route.snapshot.params.court;

    const tomorrow = DateUtil.addDays(new Date(), 1);
    this.repeatMinDate = {
      year: tomorrow.getFullYear(),
      month: tomorrow.getMonth(),
      day: tomorrow.getDay()
    };

    this.reservation.date = DateUtil.getDatePart(start);
    this.reservation.start = DateUtil.getTimePart(start);
    this.reservation.duration = 1;
    this.reservation.type = 0;
    this.reservation.courts = court;

    this.service.getSystemConfig(systemId).subscribe({
      next: (config) => {
        this.systemConfig = ReservationSystemConfig.of(config);
        this.reservation.systemConfigId = this.systemConfig.id;
        this.userService.getLoggedInUser().subscribe({
          next: (user) => {
            this.user = new User(
              user.id,
              user.name,
              userRoleFrom(user.role),
              '',
              '',
              activationStatusFrom(user.status)
            );
            this.reservation.user = user;
            this.init();
          },
          error: (usererror) => this.setError(usererror)
        });
      },
      error: (configerror) => this.setError(configerror)
    });
  }

  onTypeSelected() {
    this.showRepeat =
      this.reservationTypes.find(type => type.type == this.type)?.repeatable === true &&
      this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER);
    if (!this.showRepeat) {
      this.repeatMinDate = undefined;
      this.repeatUntil = undefined;
      this.reservation.repeatType = undefined;
      this.reservation.repeatUntil = undefined;
      this.reservation.occupations = [];
    }
  }

  onGenerateOccupations() {
    if (!this.repeatUntil || !this.time || !this.reservation || this.type < 0) {
      return;
    }
    this.clearError();
    this.reservation.occupations = [];
    this.reservation.type = this.type;
    this.reservation.start = this.time;
    this.reservation.repeatUntil = DateUtil
      .convertFromNgbDateStruct(this.repeatUntil)
      .getTime();
    this.service.checkReservation(this.reservation).subscribe({
      next: (reservation) => this.reservation = reservation,
      error: (error) => this.setError(error)
    });
  }

  onDeleteOccupation(i: number) {
    this.reservation?.occupations.splice(i, 1);
  }

  private init() {
    if (!this.reservation || !this.systemConfig) {
      return;
    }
    this._setTypes();

    // decide which parts of the layout are visible
    this.showSimpleDuration = this.systemConfig?.durationUnitInMinutes === 30
      && !this._isAtLeastTeamster();
    this.onTypeSelected();
    this.setDefaultValues();
  }

  private setDefaultValues() {
    this.reservation.text = this._getCookie('text') ?? this.user.name;
    this.reservation.duration = this.systemConfig.getDurationDefault();
    this.type = 0;
    this.time = this.reservation.start;
    this.setDefaultFocus();
  }

  private setDefaultFocus() {
    if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
      this.focus = 'date';
    }
    if (this.user.hasRole(UserRole.TRAINER, UserRole.TEAMSTER)) {
      this.focus = 'duration';
    }
    if (this.user.hasRole(UserRole.REGISTERED, UserRole.KIOSK, UserRole.TECHNICAL)) {
      this.focus = 'text';
    }
  }

  getDate() {
    return this.toDate(this.reservation!.date);
  }

  toDate(date: number) {
    return DateUtil.toDate(date).toLocaleDateString();
  }

  showTime(d: number) {
    return DateUtil.showTime(d);
  }

  onRepeatTypeChanged() {
    this.reservation!.occupations = [];
  }

  onDurationChanged(duration: number) {
    this.reservation!.duration = duration;
    this.showDouble = duration === 3;
  }

  getTimes() {
    const times = [];
    for (
      let hour = this.systemConfig!.openingHour;
      hour < this.systemConfig!.closingHour;
      hour++
    ) {
      for (
        let minute = 0;
        minute < 60;
        minute += this.systemConfig!.durationUnitInMinutes
      ) {
        times.push(DateUtil.time(hour, minute));
      }
    }
    return times;
  }

  onClick() {
    this.clearError();
    this.reservation!.type = this.type ?? -1;
    this.reservation!.start = this.time!;
    if (this.repeatUntil) {
      this.reservation!.repeatUntil = DateUtil
        .convertFromNgbDateStruct(this.repeatUntil)
        .getTime();
    }
    this._setCookie('text', this.reservation!.text);
    this.service.addReservation(this.reservation!).subscribe({
      next: (data) => {
        this.reservation = data;
        if (this.reservation.occupations.length > 1) {
          let msg = `Es wurden ${this.reservation.occupations.length} Platzbelegungen angelegt.`;
          for (const o of this.reservation.occupations) {
            msg += `\n${DateUtil.showDate(o.date)} ${DateUtil.showTime(o.start)}`;
          }
          alert(msg);
        }
        this.onBack();
      },
      error: (error) => this.setError(error)
    });
  }

  onBack() {
    this.router.navigate(['/table', this.systemConfig!.id, this.reservation!.date]);
  }

  private _getCookie(name: string) {
    return localStorage.getItem(name) ?? '';
  }

  private _setCookie(name: string, value: string) {
    localStorage.setItem(name, value);
  }

  private _isAtLeastTeamster() {
    return this.user.hasRole(
      UserRole.ADMIN,
      UserRole.TRAINER,
      UserRole.TEAMSTER
    );
  }

  private _setTypes() {
    this.reservationTypes = this.systemConfig.types
      .filter(type => type.roles.includes(UserRole[this.user.role]));
  }
}
