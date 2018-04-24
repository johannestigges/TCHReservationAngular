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
//    console.log('get time part ' + date + " " + DateUtil.toDate(date).toLocaleString() + "  "
//      + (date % DateUtil.DAY) + " " + DateUtil.toDate(date % DateUtil.DAY).toLocaleString());
    return date % DateUtil.DAY;
  }

  static getDatePart(date:number):number {
    return date - DateUtil.getTimePart(date);
  }

  static getHourPart(date:number): number {
//    console.log('get hour part ' + DateUtil.toDate(date).toLocaleString() + "  "
//      +date % DateUtil.DAY / DateUtil.HOUR);
    return DateUtil.getTimePart(date) / DateUtil.HOUR;
  }

  static getDayMinutesPart(date:number): number {
//    console.log("get day minutes " + date + " " + DateUtil.toDate(date).toLocaleString()
//      + " " + DateUtil.getTimePart(date) / DateUtil.MINUTE);
    return DateUtil.getTimePart(date) / DateUtil.MINUTE;
  }

  static toDate(date:number):Date{
    let d = new Date();
    d.setTime(date);
    return d;
  }
}
