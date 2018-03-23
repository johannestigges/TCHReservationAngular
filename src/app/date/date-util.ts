/**
 * Utility class with helper methods concerning date and time
 */
export class DateUtil {
  /**
   * Constants for time units; all in milliseconds
   */
  static SECOND = 1000;
  static MINUTE = DateUtil.SECOND * 60;
  static HOUR = DateUtil.MINUTE * 60;
  static DAY = DateUtil.HOUR * 24;

  /**
   * create a date object
   */
  static of(hour: number, minute: number = 0, day: number = 0): Date {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    if (day !== 0) {
      d.setTime(d.getTime() + day * DateUtil.DAY);
    }
    return d;
  }

  static ofMillies(milliseconds: number): Date {
    const d = new Date();
    d.setTime(milliseconds);
    return d;
  }

  static copyTime(d1: Date, d2: Date): Date {
    const d3 = new Date(d1);
    d3.setHours(d2.getHours(), d2.getMinutes(), d2.getSeconds(), d2.getMilliseconds());
    return d3;
  }

  static addMinutes(date: Date, minutes: number): Date {
    return DateUtil.add(date, minutes * DateUtil.MINUTE);
  }

  static addHours(date: Date, hours: number): Date {
    return DateUtil.add(date, hours * DateUtil.HOUR);

  }
  static addDays(date: Date, days: number): Date {
    return DateUtil.add(date, days * DateUtil.DAY);
  }

  static add(date: Date, milliseconds: number): Date {
    const d = new Date();
    d.setTime(date.getTime() + milliseconds);
    return d;
  }

  static stripTime(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  static dateDiff(d1: Date, d2: Date): number {
    return (DateUtil.stripTime(d1).getTime() - DateUtil.stripTime(d2).getTime()) / DateUtil.DAY;
  }

  static isSameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() //
      && d1.getMonth() === d2.getMonth() //
      && d1.getDate() === d2.getDate();
  }
}