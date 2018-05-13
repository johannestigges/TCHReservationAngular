import { ReservationType } from './reservationtype';
import { User } from './../user/user';

export class Reservation {

  public id:number;

  constructor(
    public systemConfigId: number, //
    public user: User, //
    public text: string, //
    public date: number, // date of reservation in epocj ofMillies
    public start: number, // start time of reservation in epoch ofMillies
    public duration: number, //
    public courts: string, //
    public type: ReservationType, //
    public weeklyRepeatUntil? : number) {
    this.id = Math.floor(Math.random() * 100000000 );
  }

  setCourts(...courts: number[]) {
    this.courts = courts.join(' ');
  }

  addCourts(...courts: number[]) {
    this.courts = this.courts + courts.join(' ');
  }

  getCourts(): number[] {
    return this.courts.split(" ").map(function(court) {
      return parseInt(court);
    });
  }
}
