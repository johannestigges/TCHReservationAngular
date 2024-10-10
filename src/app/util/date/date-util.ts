import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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

	static getTimePart(date: number): number {
		const d1 = DateUtil.toDate(date);
		const d2 = DateUtil.toDate(0);
		d2.setDate(d1.getDate());
		d2.setMonth(d1.getMonth());
		d2.setFullYear(d1.getFullYear());
		return d1.getTime() - d2.getTime();
	}

	static convertFromNgbDateStruct(dateStruct: NgbDateStruct): Date {
		console.log(dateStruct.year, dateStruct.month, dateStruct.day);
		const date = new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day, 12);
		console.log(date);
		date.setFullYear(dateStruct.year);
		return date;
	}

	static getDatePart(date: number): number {
		const d = DateUtil.toDate(date);
		d.setHours(0, 0, 0);
		d.setMilliseconds(0);
		return d.getTime();
	}

	static getHourPart(date: number): number {
		//    console.log('get hour part ' + DateUtil.toDate(date).toLocaleString() + "  "
		//      +date % DateUtil.DAY / DateUtil.HOUR);
		return DateUtil.toDate(date).getHours();
	}

	static getDayMinutesPart(date: number): number {
		const d = DateUtil.toDate(date);
		return d.getHours() * 60 + d.getMinutes();
	}

	static toDate(date: number): Date {
		const d = new Date();
		d.setTime(date);
		return d;
	}

	static time(hour: number, minute: number): number {
		const now = new Date();
		now.setHours(hour,minute,0,0);
		return DateUtil.getTimePart(now.getTime());
	}

	static ofDateAndTime(date: number, time: number): Date {
		const d1 = DateUtil.toDate(date);
		const d2 = DateUtil.toDate(time);
		d1.setHours(d2.getHours(), d2.getMinutes(), d2.getSeconds());
		return d1;
	}

	static isToday(date: number): boolean {
		return this.getDatePart(date) === this.getDatePart(this.now());
	}

	static getActualTime(): number {
		return this.getDayMinutesPart(this.now());
	}

	static now(): number {
		return new Date().getTime();
	}

	static showDate(date: number): string {
		return this.toDate(date).toLocaleDateString();
	}

	static showTime(time: number): string {
		return this.toDate(time).toLocaleTimeString();
	}

	static showDateTime(date: number): string {
		return this.toDate(date).toLocaleString();
	}

	static addDays(date: Date, days: number): Date {
		date.setDate(date.getDate() + days);
		return date;
	}
}
