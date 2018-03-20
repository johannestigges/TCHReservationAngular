/**
 * reservation date
 */
export class RDate {

  /**
   * 
   * @param start start of reservation
   * @param interval interval in minutes
   */
  constructor(public start: Date, public interval: number) { }

  rows(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / this.interval;
  }

  row(date: Date): number {
    return this.rows(this.start, date);
  }

  date(row: number): Date {
    return new Date(this.start.getTime() + row * this.interval);
  }
}
