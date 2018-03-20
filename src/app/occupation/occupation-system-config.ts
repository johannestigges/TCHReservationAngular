import {DateUtil} from '../date/date-util';

/**
 * reservation system configuration data
 */
export class OccupationSystemConfig {

  constructor(
    public id: number,            // system configuration id
    public courts: number,        // number of available courts
    public durationUnit: number,  // smallest reservation unit in minutes
    public openingHour: number,   // first reservation hour
    public closingHour: number,    // last reservation hour
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
   * get array of times from openin hour to closing hour as
   * [ '08:00', '08:30', '09:00' , ...]
   */
  public getTimes(): string[] {
    let times = [];
    for (let hour = this.openingHour; hour < this.closingHour; hour++) {
      for (let minute = 0; minute < 60; minute += this.durationUnit) {
        times.push(DateUtil.of(hour, minute).toLocaleTimeString());
      }
    }
    return times;
  }

  /**
   * get the number of rows from opening hour to closing hour
   */
  public getRows(): number {
    return (this.closingHour - this.openingHour) * 60 / this.durationUnit
  }
}