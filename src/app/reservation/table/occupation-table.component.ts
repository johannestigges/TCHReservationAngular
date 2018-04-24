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
  error: string;
  lastUpdated: number;

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

    // create occupation table
    this.occupationTable = new OccupationTable(this.user, this.systemConfig);

    // set date
    if (this.route.snapshot.params['date']) {
      this.occupationTable.setDate(parseInt(this.route.snapshot.params['date']));
    }

    // update occupation table
    this.update(this.occupationTable.date);
  }

  canModify(occupation: Occupation): boolean {
    // admin can modify everything
    if (this.user.hasRole(UserRole.ADMIN)) {
      return true;
    }

    // cannot modify occupation in the past.subscribe(o => this.occupations.push(o));
    if (occupation.start < this.lastUpdated) {
      return false;
    }
    // can only modify my ccupations
    return occupation.user == this.user.id;
  }

  canAdd(date: number): boolean {

    // admin can add everything
    if (this.user.hasRole(UserRole.ADMIN)) {
      return true;
    }
    // cannot add occupation in the past
    if (date < this.lastUpdated) {
      return false;
    }
    // trainer can add occupation
     if (this.user.hasRole(UserRole.TRAINER)) {
      return true;
    }
    // only for the next 2 hours
    return (date - this.lastUpdated < 2 * DateUtil.HOUR);
  }

  /**
   * update table: read occupations asynchronously and show table
   */
  private update(date:number) {
    this.reservationService.getOccupations(this.systemConfig.id, date)
      .subscribe(
        data => {
          this.lastUpdated = new Date().getTime();
          this.occupationTable.setDate(date);
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

  showError(error) {
    this.error = JSON.stringify(error);
    console.log(this.error);
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
