import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReservationService } from '../reservation.service';
import { ReservationSystemConfig } from '../reservation-system-config';
import { OccupationTable } from './occupation-table';
import { Occupation } from '../occupation';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole } from '../../user/user-role.enum';
import { ActivationStatus } from '../../user/activation-status.enum';
import { DateUtil } from '../../date/date-util';
import { ErrorAware } from '../../error/error-aware';
import { Observable, timer, Subscription } from 'rxjs';


@Component({
  selector: 'tch-occupation-table',
  templateUrl: './occupation-table.component.html',
  styleUrls: ['./occupation-table.component.css']
})
export class OccupationTableComponent extends ErrorAware implements OnInit, OnDestroy {

  occupationTable: OccupationTable;
  systemConfig: ReservationSystemConfig;
  lastUpdated: number;
  private timer: Observable<number>;
  private timerSubscription: Subscription;

  constructor(private reservationService: ReservationService,
    private userService: UserService,
    private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    // read system config
    this.systemConfig = this.reservationService.getSystemConfig(this.route.snapshot.params.system);

    // create occupation table
    this.occupationTable = new OccupationTable(new User(0, '', UserRole.ANONYMOUS), this.systemConfig);

    // set date
    if (this.route.snapshot.params.date) {
      this.occupationTable.setDate(parseInt(this.route.snapshot.params.date, 10));
    }

    // get logged in user
    this.userService.getLoggedInUser().subscribe(
      data => {
        this.occupationTable.setUser(
          new User(data.id, data.name, UserRole['' + data.role], '', '', ActivationStatus['' + data.status]));
      },
      err => {
        this.httpError = err;
      },
      () => {
        // reload system when user is 'kiosk' every 5 Minutes
        if (this.occupationTable.user.hasRole(UserRole.KIOSK)) {
          this.timer = timer(300000, 300000);
          this.timerSubscription = this.timer.subscribe(
            () => this.update(this.occupationTable.date)
          );
        }
      }
    );

    // update occupation table
    this.update(this.occupationTable.date);
  }

  ngOnDestroy() {
    // unsubscribe refresh timer when in kiosk mode
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  isLoggedIn() {
    return !this.occupationTable.user.hasRole(UserRole.ANONYMOUS);
  }

  isKiosk() {
    return this.occupationTable.user.hasRole(UserRole.KIOSK);
  }

  isAdmin() {
    return this.occupationTable.user.hasRole(UserRole.ADMIN);
  }

  canModify(occupation: Occupation): boolean {

    // admin and trainer can modify everything
    if (this.occupationTable.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
      return true;
    }

    // cannot modify occupation in the past
    if (DateUtil.ofDateAndTime(occupation.date, occupation.start).getTime() < this.lastUpdated) {
      return false;
    }

    // can only modify my ccupations
    return '' + occupation.reservation.user.id === '' + this.occupationTable.user.id;
  }

  canAdd(date: number): boolean {

    // admin and trainer can add everything
    if (this.occupationTable.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
      return true;
    }

    // cannot add occupation in the past
    if (date < this.lastUpdated) {
      return false;
    }

    // only for the next 1 hours
    return (date - this.lastUpdated < 1 * DateUtil.HOUR);
  }

  /**
   * update table: read occupations asynchronously and show table
   */
  private update(date: number) {
    this.clearError();
    this.reservationService.getOccupations(this.systemConfig.id, date)
      .subscribe(
        data => {
          console.log('got occupations', data);
          this.lastUpdated = new Date().getTime();
          this.occupationTable.setDate(date);
          this.show(data);
        },
        err => {
          this.httpError = err;
        },
        () => {
          //          console.log("finished update reservations for " + date);
        }
      );
  }

  showDate() {
    return DateUtil.toDate(this.occupationTable.date).toLocaleDateString();
  }

  private show(occupations: Occupation[]) {
    this.occupationTable.occupations = occupations;
    this.occupationTable.show();
  }

  onBackWeek() {
    this.update(this.occupationTable.date - 7 * DateUtil.DAY);
  }

  onBackDay() {
    this.update(this.occupationTable.date - DateUtil.DAY);
  }

  onToday() {
    this.update(new Date().getTime());
  }

  onNextDay() {
    this.update(this.occupationTable.date + DateUtil.DAY);
  }

  onNextWeek() {
    this.update(this.occupationTable.date + 7 * DateUtil.DAY);
  }
}
