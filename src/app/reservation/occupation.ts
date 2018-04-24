import { ReservationType } from './reservationtype';

/**
 * data of one occupation
 */
export class Occupation {

  public id: number;

  constructor(
    public systemConfigId: number, //
    public reservation: number, //
    public user: number, //
    public text: string, //
    public date: number, // date of occupation in epoch millies
    public start: number, // start time of occupation in epoch ofMillies
    public duration: number, //
    public court: number, //
    public lastCourt: number = court, //
    public type: ReservationType) {
    this.id = Math.floor(Math.random() * 100000000 );
  }
}
