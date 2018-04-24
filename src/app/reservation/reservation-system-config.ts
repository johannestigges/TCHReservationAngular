import { DateUtil } from '../date/date-util';

/**
 * reservation system configuration data
 */
export class ReservationSystemConfig {

  constructor(
    public id: number,              // system configuration id
    public name: string,            // name of reservation system
    public courts: number,          // number of available courts
    public durationUnitInMinutes: number, // smallest reservation unit
    public openingHour: number,     // first reservation hour
    public closingHour: number,     // last reservation hour
    public reservationfrom: number, // reservation possible from
    public reservationUntil: number // reservation possible until
  ) { }

  /**
   * get array of court [1,2,3,...]
   */
  public getCourtsArray(): number[] {
    return Array.from(new Array(this.courts), (val, index) => index + 1);
  }

  /**
   * get the number of rows from opening hour to closing hour
   */
  public getRows(): number {
    return (this.closingHour - this.openingHour) * 60 / this.durationUnitInMinutes;
  }

  public toRow(date:number): number {
    return (DateUtil.getDayMinutesPart(date) - this.openingHour * 60) / this.durationUnitInMinutes;
  }

  public toMinutes(row: number) {
    return this.openingHour * 60 + row * this.durationUnitInMinutes;
  }

  public setTime(date:Date, row:number) {
    date.setHours(0, this.toMinutes(row));
  }
}
