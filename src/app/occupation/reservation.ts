import { OccupationType } from './occupationtype';

export class Reservation {

  public id:number;

  constructor(
    public systemConfigId: number, //
    public user: number, //
    public text: string, //
    public date: Date, //
    public start: Date, //
    public duration: number, //
    public courts: string, //
    public type: ReservationType, //
    public weeklyRepeatUntil: Date) {
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
