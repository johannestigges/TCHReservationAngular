import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ReservationType } from '../reservationtype';
import { ReservationService } from '../reservation.service';
import { ReservationSystemConfig } from '../reservation-system-config';
import { Reservation } from '../reservation';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole } from '../../user/user-role.enum';
import { DateUtil } from '../../date/date-util';

@Component({
  selector: 'reservation-add',
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.css']
})
export class ReservationAddComponent {

  systemConfig: ReservationSystemConfig;
  user: User;
  reservation: Reservation;
  error:string;

  repeat: number;
  time: number;
  type: string;

  types: string[];

  showType: boolean;
  showText: boolean;
  showDuration: boolean;
  showRepeat: boolean;
  focus: string;

  constructor(private route: ActivatedRoute, private router: Router, private location: Location,
    private service: ReservationService, private userService: UserService) {
  }

  ngOnInit() {
    this.systemConfig = this.service.getSystemConfig(this.route.snapshot.params['system']);
    this.user = this.userService.getUser(this.route.snapshot.params['user']);

    // create option list of occupation types
    this.types = Object.keys(ReservationType).map(key => ReservationType[key])
      .filter(value => typeof value === 'string');

    // set default values
    const start = parseInt(this.route.snapshot.params['date']);
    console.log('Start ' + start + ' ' + DateUtil.getDatePart(start) + ' ' + DateUtil.getTimePart(start));

    this.reservation = new Reservation(
      this.systemConfig.id,
      this.user.id,                           // user id
      this.user.name,                         // text = user name
      DateUtil.getDatePart(start),            // reservation Date
      DateUtil.getTimePart(start),            // reservation start
      2,                                      // duration default
      this.route.snapshot.params['court'],    // court
      ReservationType.Quickbuchung,           // default type
    );

    this.time = this.reservation.start;
    this.type = ReservationType[this.reservation.type];

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
    let times = [];
    for (let hour = this.systemConfig.openingHour; hour < this.systemConfig.closingHour; hour++) {
      for (let minute = 0; minute < 60; minute += this.systemConfig.durationUnitInMinutes) {
        times.push((hour * 60 + minute) * DateUtil.MINUTE);
      }
    }
    return times;
  }

  private showError(error) {
    this.error = JSON.stringify(error);
    console.log(this.error);
  }

  onClick() {
    this.reservation.type = ReservationType[this.type];
    this.reservation.start = this.time;
    this.service.addReservation(this.reservation)
      .subscribe(
        data => {
          this.reservation = data;
          this.onBack();
        },
        err => {
          this.showError(err);
        },
        () => { this.onBack(); }
      );
  }

  onBack() {
    this.router.navigate(["/table", this.systemConfig.id, this.user.id, this.reservation.date]);
  }
}
