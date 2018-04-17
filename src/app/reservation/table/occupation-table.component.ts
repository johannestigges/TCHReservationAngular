import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';

import { ReservationService } from '../reservation.service';
import { ReservationSystemConfig } from '../reservation-system-config';
import { ReservationType } from '../reservationtype';
import { OccupationTable } from './occupation-table';
import { Occupation } from '../occupation';
import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole } from '../../user/user-role.enum';
import { DateUtil } from '../../date/date-util';

@Component({
  selector: 'app-root',
  templateUrl: './occupation-table.component.html',
  styleUrls: ['./occupation-table.component.css']
})
export class OccupationTableComponent {

  occupationTable: OccupationTable;
  user: User;
  systemConfig: ReservationSystemConfig;
  date: Date;
  error: string;

  constructor(private reservationService: ReservationService,
    private userService: UserService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    // read system config
    this.systemConfig = this.reservationService.getSystemConfig(this.route.snapshot.params['system']);

    // get user
    if (this.route.snapshot.params['user']) {
      this.user = this.userService.getUser(this.route.snapshot.params['user']);
    } else {
      this.user = new User(0, "", UserRole.ANONYMOUS);
    }

    // set date
    this.date = new Date();
    if (this.route.snapshot.params['date']) {
      this.date.setTime(this.route.snapshot.params['date']);
    }

    // create and update occupation table
    this.occupationTable = new OccupationTable(this.user, this.systemConfig);
    this.update(this.date);
  }

  canModify(occupation: Occupation): boolean {
    // admin can modify everything
    if (this.user.hasRole(UserRole.ADMIN)) {
      return true;
    }

    // cannot modify occupation in the past.subscribe(o => this.occupations.push(o));
    if (occupation.start < new Date().getTime()) {
      return false;
    }
    // can only modify my ccupations
    return occupation.user == this.user.id;
  }

  canAdd(date: Date): boolean {
    const now = new Date();
    // admin can add everything
    if (this.user.hasRole(UserRole.ADMIN)) {
      return true;
    }
    // cannot add occupation in the past
    if (date.getTime() < now.getTime()) {
      return false;
    }
    // trainer can add occupation
    if (this.user.hasRole(UserRole.TRAINER)) {
      return true;
    }
    // only for the next 2 hours
    return (date.getTime() - now.getTime() < DateUtil.HOUR * 2);
  }

  /**
   * update table: read occupations asynchronously and show table
   */
  private update(date: Date) {
    this.date = date;
    this.reservationService.getOccupations(this.systemConfig.id, this.date)
      .subscribe(
        data => {
          console.log(JSON.stringify(data));
          this.occupationTable.occupations = data;
          console.log(JSON.stringify(this.occupationTable.occupations));

          this.show(data);
        },
        err => {
          this.showError(err);
        },
        () => {
          console.log("finished update reservations for " + date);
        }
      );
  }

  public showError(error) {
    this.error = error;
    console.log(error);
  }

  private show(occupations: Occupation[]) {
    this.occupationTable.occupations = occupations;
    this.occupationTable.show(this.date);
  }

  onBackWeek() {
    this.update(DateUtil.addDays(this.date, -7));
  }

  onBackDay() {
    this.update(DateUtil.addDays(this.date, -1));
  }

  onToday() {
    this.update(new Date());
  }

  onNextDay() {
    this.update(DateUtil.addDays(this.date, 1));
  }

  onNextWeek() {
    this.update(DateUtil.addDays(this.date, 7));
  }
}
