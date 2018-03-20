import { OccupationType } from './occupationtype';

/**
 * data of one occupation
 */
export class Occupation {

  public id: number;

  constructor(
    public start: Date, // 
    public duration: number, //
    public occupationType: OccupationType, //
    public text: string, //
    public userid: number, //
    public court: number, //
    public lastCourt: number = court) {
    this.id = Math.floor(Math.random() * 100000000 );
  }
}
