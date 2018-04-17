import { RDate } from '../../date/date';
import { DateUtil } from '../../date/date-util';
import { TableData } from '../../table/table-data';

import { Occupation } from '../occupation';
import { ReservationType } from '../reservationtype';
import { AvailableEntry } from './available-entry';
import { User } from '../../user/user';
import { UserRole } from '../../user/user-role.enum';
import { ReservationSystemConfig } from '../reservation-system-config';

export class OccupationTable extends TableData {

  occupations: Occupation[] = [];
  start: RDate;

  constructor(public user: User, public systemConfig: ReservationSystemConfig) {
    super();
    this.start = new RDate(new Date(), this.systemConfig.durationUnitInMinutes * DateUtil.MINUTE);
    this.createEmptyTable();
  }

  show(date: Date) {
    const d = new Date(date);
    console.log("show date " + JSON.stringify(date));
    d.setHours(this.systemConfig.openingHour,0,0,0);
    console.log("show date " + JSON.stringify(d));
    this.start = new RDate(d, this.systemConfig.durationUnitInMinutes * DateUtil.MINUTE);
    console.log("show rdate " + JSON.stringify(this.start));
    this.createEmptyTable();
    for (const occupation of this.occupations) {
        this.addOccupation(occupation);
    }
  }

  private addOccupation(occupation: Occupation) {
    console.log("add occupation " + occupation.text + ": " + JSON.stringify(occupation));
    console.log(occupation.start);
    console.log(new Date(occupation.start));
    console.log(new Date(parseInt(occupation.start)));
    console.log(JSON.stringify(new Date(occupation.start)));
    const row = this.start.row(new Date(occupation.start));
    const column = occupation.court;
    const rowspan = occupation.duration;
    const colspan = occupation.lastCourt - occupation.court + 1;
    console.log ("cell("+row+","+column+") span(" + rowspan + "," + colspan + ")");

    this.setCell(row, column, rowspan, colspan);
    this.setData(row, column, occupation);
  }

  createEmptyTable(rowspan = 2) {
    this.clearAll();
    for (let row = 0; row < this.systemConfig.getRows(); row++) {
      let mainRow: boolean = row % rowspan == 0;

      // first column: time
      if (mainRow) {
        this.setCell(row, 0, rowspan);
        this.setData(row, 0, { 'time': this.showTime(row) });
      }
      // court columnsconfigId
      for (let column = 0; column < this.systemConfig.courts; column++) {
        if (this.canMakeReservation(row)) {
          this.setCell(row, column + 1);
          this.setData(row, column + 1,
            new AvailableEntry (this.start.date(row), column + 1, mainRow ? 'available' : 'available_light'));
        } else {
          if (mainRow) {
            this.setCell(row, column + 1, rowspan);
          }
        }
      }
    }
  }

  canMakeReservation(row) {
    if (!this.user || this.user.hasRole(UserRole.ANONYMOUS)) {
      return false;
    }
    if (this.user.hasRole(UserRole.ADMIN, UserRole.TRAINER)) {
      return true;

    }
    if (this.user.hasRole(UserRole.KIOSK, UserRole.REGISTERED)) {
      return true;
    }
    return false;
  }

  private showTime(row: number): string {
    const hour = this.start.date(row).getHours();
    return hour + ':00 - ' + (hour + 1) + ':00';
  }
 }
