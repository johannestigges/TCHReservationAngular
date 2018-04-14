import { OccupationType } from './occupationtype';

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
    public date: Date, //
    public start: Date, //
    public duration: number, //
    public court: number, //
    public lastCourt: number = court, //
    public occupationType: OccupationType) {
    this.id = Math.floor(Math.random() * 100000000 );
  }
}
