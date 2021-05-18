import { DateUtil } from '../date/date-util';
import { Reservation } from './reservation';
import { Occupation } from './occupation';

/**
 * reservation system configuration data
 */
export class ReservationSystemConfig {

  constructor(
    public id: number,              // system configuration id
    public name: string,            // name of reservation system
    public courts: string[],    // names of courts
    public durationUnitInMinutes: number, // smallest reservation unit
    public openingHour: number,     // first reservation hour
    public closingHour: number,     // last reservation hour
    public reservationfrom: number, // reservation possible from
    public reservationUntil: number // reservation possible until
  ) { }

  public static of(config: ReservationSystemConfig) {
    return new ReservationSystemConfig(
      config.id,
      config.name,
      config.courts,
      config.durationUnitInMinutes,
      config.openingHour,
      config.closingHour,
      config.reservationfrom,
      config.reservationUntil);
  }

  /**
   * get array of court indices [0,1,2,3,...]
   */
  public getCourtIndices(): number[] {
    return Array.from(new Array(this.courts.length), (val, index) => index);
  }

  public getCourtName(index: number): string {
    return this.courts[index];
  }

  /**
   * get the number of rows from opening hour to closing hour
   */
  public getRows(): number {
    return (this.closingHour - this.openingHour) * 60 / this.durationUnitInMinutes;
  }

  public toRow(date: number): number {
    return (DateUtil.getDayMinutesPart(date) - this.openingHour * 60) / this.durationUnitInMinutes;
  }

  public toMinutes(row: number) {
    return this.openingHour * 60 + row * this.durationUnitInMinutes;
  }

  public setTime(date: Date, row: number) {
    date.setHours(0, this.toMinutes(row));
  }

  public getEnd(date: number, start: number, duration: number) {
    const d = duration * this.durationUnitInMinutes * DateUtil.MINUTE;
    return +date + +start + +d;
  }

  public getReservationEnd(reservation: Reservation) {
    return this.getEnd(reservation.date, reservation.start, reservation.duration);
  }

  public getOccupationEnd(occupation: Occupation) {
    return this.getEnd(occupation.date, occupation.start, occupation.duration);
  }

  public getDurationDefault() {
    if (this.durationUnitInMinutes === 60) {
      return 1;
    }
    return 2;
  }
}
