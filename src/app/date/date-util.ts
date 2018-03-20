export class DateUtil {
  static SECOND = 1000;
  static MINUTE = DateUtil.SECOND * 60;
  static HOUR = DateUtil.MINUTE * 60;
  static DAY = DateUtil.HOUR * 24;

  static of(hour: number, minute: number = 0, day: number = 0): Date {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    if (day !== 0) {
      d.setTime(d.getTime() + day * DateUtil.DAY);
    }
    return d;
  }

  static addMinutes(date: Date, minutes: number): Date {
    let d = new Date();
    d.setTime(date.getTime() + minutes * DateUtil.MINUTE);
    return d;
  }

  static stripTime(date: Date): Date {
    const d = new Date(date);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
  }

  static dateDiff(d1: Date, d2:Date): number {
    return (DateUtil.stripTime(d1).getTime() - DateUtil.stripTime(d2).getTime()) / DateUtil.DAY;
  }

  static isSameDay(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() //
      && d1.getMonth() === d2.getMonth() //
      && d1.getDate() === d2.getDate();
  }
}