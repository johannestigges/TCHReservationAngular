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

  static getTimePart(date:number):number {
    const d1 = DateUtil.toDate(date);
    const d2 = DateUtil.toDate(0);
    d2.setDate(d1.getDate());
    d2.setMonth(d1.getMonth());
    d2.setFullYear(d1.getFullYear());
    console.log('get time part ' + date + " " + d1.toLocaleString() + "  "
      +  d2.toLocaleString() + " " + (d1.getTime() - d2.getTime()));
    return d1.getTime() - d2.getTime();
  }

  static getDatePart(date:number):number {
    const d = DateUtil.toDate(date);
    d.setHours(0,0,0);
    d.setMilliseconds(0);
    return d.getTime();
  }

  static getHourPart(date:number): number {
//    console.log('get hour part ' + DateUtil.toDate(date).toLocaleString() + "  "
//      +date % DateUtil.DAY / DateUtil.HOUR);
    return DateUtil.toDate(date).getHours();
  }

  static getDayMinutesPart(date:number): number {
    const d = DateUtil.toDate(date);
//    console.log("get day minutes " + date + " " + DateUtil.toDate(date).toLocaleString()
//      + " " + DateUtil.getTimePart(date) / DateUtil.MINUTE);
    return d.getHours() * 60 + d.getMinutes();
  }

  static toDate(date:number):Date{
    let d = new Date();
    d.setTime(date);
    return d;
  }
}
