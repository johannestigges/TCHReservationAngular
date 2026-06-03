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

	/** Parses an ISO date string (YYYY-MM-DD) into a Date at noon local time. */
	static fromIsoDate(isoDate: string): Date {
		const [year, month, day] = isoDate.split('-').map(Number);
		const date = new Date(year, month - 1, day, 12);
		date.setFullYear(year);
		return date;
	}

	/** Formats a Date as an ISO date string (YYYY-MM-DD) for use in date inputs. */
	static toIsoDate(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	static getDatePart(date: number): number {
		const d = DateUtil.toDate(date);
		d.setHours(0, 0, 0);
		d.setMilliseconds(0);
		return d.getTime();
	}

	static getHourPart(date: number): number {
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
