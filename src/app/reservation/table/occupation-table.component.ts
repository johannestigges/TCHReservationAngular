import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ReservationService } from '../reservation.service';
import { OccupationTable } from './occupation-table';
import { Occupation } from '../occupation';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole } from '../../user/user-role.enum';
import { ActivationStatus } from '../../user/activation-status.enum';
import { DateUtil } from '../../date/date-util';
import { ErrorAware } from '../../error/error-aware';
import { Observable, timer, Subscription } from 'rxjs';
import { ReservationType } from '../reservationtype';


@Component({
  selector: 'tch-occupation-table',
  templateUrl: './occupation-table.component.html',
  styleUrls: ['./occupation-table.component.css']
})
export class OccupationTableComponent extends ErrorAware implements OnInit, OnDestroy {

  occupationTable: OccupationTable;
  lastUpdated: number;
  private timer: Observable<number>;
  private timerSubscription: Subscription;

  constructor(
    private reservationService: ReservationService,
    private userService: UserService,
    private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    const systemId = this.route.snapshot.params.system;
    const date = this.route.snapshot.params.date;
    this.occupationTable = new OccupationTable(new User(0, '', UserRole.ANONYMOUS));
    // set date
    if (date) {
      this.occupationTable.setDate(parseInt(date, 10));
    }

    // read system config
    this.reservationService.getSystemConfig(systemId).subscribe(
      systemConfig => {
        this.occupationTable.setSystemConfig(systemConfig);

        // get logged in user
        this.userService.getLoggedInUser().subscribe(
          user => {
            this.occupationTable.setUser(
              new User(user.id, user.name, UserRole['' + user.role], '', '',
                ActivationStatus['' + user.status]));
            // update occupation table
            this.update(this.occupationTable.date);
          },
          usererror => this.httpError = usererror,
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
      },
      configerror => this.httpError = configerror
    );
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

  canChangePassword() {
    return this.isLoggedIn() && !this.occupationTable.user.hasRole(UserRole.KIOSK, UserRole.TECHNICAL);
  }

  canLogout() {
    return this.isLoggedIn() && !this.occupationTable.user.hasRole(UserRole.KIOSK);
  }

  isAdmin() {
    return this.occupationTable.user.hasRole(UserRole.ADMIN);
  }

  canModify(occupation: Occupation): boolean {
    if (!this.isLoggedIn()) {
      return false;
    }

    // admin and trainer can modify everything
    if (this.occupationTable.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
      return true;
    }

    const now = new Date().getTime();
    const start = DateUtil.ofDateAndTime(occupation.date, occupation.start).getTime();
    const end = this.occupationTable.systemConfig.getOccupationEnd(occupation);

    // everyone can terminate current reservation
    if (start < now && end > now) {
      return true;
    }

    // cannot modify occupation in the past
    if (start < now) {
      return false;
    }

    // can only modify my ccupations
    return occupation.reservation.user.id === this.occupationTable.user.id;
  }

  canShowText(occupation: Occupation) {
    return ReservationType[occupation.type] !== ReservationType[ReservationType.Quickbuchung]
      || this.isLoggedIn();
  }

  canAdd(date: number): boolean {
    if (!this.isLoggedIn()) {
      return false;
    }

    // admin and trainer can add everything
    if (this.occupationTable.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
      return true;
    }

    // cannot add occupation in the past
    if (date < this.lastUpdated) {
      return false;
    }

    // only for this and some days
    return (date - this.lastUpdated < 
      this.occupationTable.systemConfig.maxDaysReservationInFuture * DateUtil.DAY);
  }

  /**
   * update table: read occupations asynchronously and show table
   */
  private update(date: number) {
    this.clearError();
    this.reservationService.getOccupations(this.occupationTable.systemConfig.id, date)
      .subscribe(
        data => {
          this.lastUpdated = new Date().getTime();
          this.occupationTable.setDate(date);
          this.show(data);
        },
        err => {
          this.httpError = err;
        },
      );
  }

  showDate() {
    return DateUtil.toDate(this.occupationTable.date).toLocaleDateString(
      'de-DE',
      {weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric'});
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
