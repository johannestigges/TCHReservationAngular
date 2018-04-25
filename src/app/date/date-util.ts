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
    const d = DateUtil.toDate(date);
    const d2 = DateUtil.toDate(0);
    d2.setDay(d1.getDay());
    d2.setMonth(d1.getMonth());
    d2.setFullYear(d1.getFullYear());
    console.log('get time part ' + date + " " + d.toLocaleString() + "  "
      +  d2.toLocaleString() + " " + d.getTime() - d2.getTime());
    return d.getTime() - d2.getTime();
  }

  static getDatePart(date:number):number {
    const d = DateUtil.of(date);
    d.setHours(0,0,0);
    d.setMilliseconds(0);
    return return d.getTime();
  }

  static getHourPart(date:number): number {

//    console.log('get hour part ' + DateUtil.toDate(date).toLocaleString() + "  "
//      +date % DateUtil.DAY / DateUtil.HOUR);
    return DateUtil.of(date).getHour();
  }

  static getDayMinutesPart(date:number): number {
    const d = DateUtil.of(date);
//    console.log("get day minutes " + date + " " + DateUtil.toDate(date).toLocaleString()
//      + " " + DateUtil.getTimePart(date) / DateUtil.MINUTE);
    return d.getHour() * 60 + d.getMinute();
  }

  static toDate(date:number):Date{
    let d = new Date();
    d.setTime(date);
    return d;
  }
}
