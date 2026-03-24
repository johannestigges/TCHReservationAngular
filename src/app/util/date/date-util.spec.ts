import { DateUtil } from './date-util';

describe('DateUtil', () => {

  describe('constants', () => {
    it('SECOND should be 1000ms', () => expect(DateUtil.SECOND).toBe(1000));
    it('MINUTE should be 60 seconds', () => expect(DateUtil.MINUTE).toBe(60_000));
    it('HOUR should be 60 minutes', () => expect(DateUtil.HOUR).toBe(3_600_000));
    it('DAY should be 24 hours', () => expect(DateUtil.DAY).toBe(86_400_000));
  });

  describe('toDate', () => {
    it('should convert epoch millis to a Date with the same time', () => {
      const millis = new Date(2024, 5, 15, 10, 30, 0).getTime();
      const result = DateUtil.toDate(millis);
      expect(result.getTime()).toBe(millis);
    });
  });

  describe('getDatePart', () => {
    it('should return midnight of the given local date', () => {
      const input = new Date(2024, 5, 15, 14, 30, 45, 999);
      const result = new Date(DateUtil.getDatePart(input.getTime()));
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('two dates on the same day should have equal date parts', () => {
      const d1 = new Date(2024, 5, 15, 8, 0, 0).getTime();
      const d2 = new Date(2024, 5, 15, 22, 59, 59).getTime();
      expect(DateUtil.getDatePart(d1)).toBe(DateUtil.getDatePart(d2));
    });

    it('dates on different days should have different date parts', () => {
      const d1 = new Date(2024, 5, 15, 23, 59, 0).getTime();
      const d2 = new Date(2024, 5, 16, 0, 0, 1).getTime();
      expect(DateUtil.getDatePart(d1)).not.toBe(DateUtil.getDatePart(d2));
    });
  });

  describe('getHourPart', () => {
    it('should return the local hour of the given timestamp', () => {
      const date = new Date(2024, 5, 15, 14, 30, 0);
      expect(DateUtil.getHourPart(date.getTime())).toBe(14);
    });

    it('should return 0 for midnight', () => {
      const date = new Date(2024, 5, 15, 0, 0, 0);
      expect(DateUtil.getHourPart(date.getTime())).toBe(0);
    });

    it('should return 23 for 23:59', () => {
      const date = new Date(2024, 5, 15, 23, 59, 0);
      expect(DateUtil.getHourPart(date.getTime())).toBe(23);
    });
  });

  describe('getDayMinutesPart', () => {
    it('should return hours*60 + minutes', () => {
      const date = new Date(2024, 5, 15, 14, 30, 0);
      expect(DateUtil.getDayMinutesPart(date.getTime())).toBe(14 * 60 + 30);
    });

    it('should return 0 for midnight', () => {
      const date = new Date(2024, 5, 15, 0, 0, 0);
      expect(DateUtil.getDayMinutesPart(date.getTime())).toBe(0);
    });

    it('should return 1439 for 23:59', () => {
      const date = new Date(2024, 5, 15, 23, 59, 0);
      expect(DateUtil.getDayMinutesPart(date.getTime())).toBe(23 * 60 + 59);
    });
  });

  describe('now', () => {
    it('should return a value close to the current time', () => {
      const before = Date.now();
      const result = DateUtil.now();
      const after = Date.now();
      expect(result).toBeGreaterThanOrEqual(before);
      expect(result).toBeLessThanOrEqual(after);
    });
  });

  describe('isToday', () => {
    it('should return true for the current time', () => {
      expect(DateUtil.isToday(DateUtil.now())).toBeTrue();
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(DateUtil.isToday(yesterday.getTime())).toBeFalse();
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(DateUtil.isToday(tomorrow.getTime())).toBeFalse();
    });
  });

  describe('getActualTime', () => {
    it('should return today\'s minutes matching now()', () => {
      const before = DateUtil.getDayMinutesPart(DateUtil.now());
      const actual = DateUtil.getActualTime();
      const after = DateUtil.getDayMinutesPart(DateUtil.now());
      expect(actual).toBeGreaterThanOrEqual(before);
      expect(actual).toBeLessThanOrEqual(after);
    });
  });

  describe('ofDateAndTime', () => {
    it('should combine the date from the first arg and time from the second', () => {
      const date = new Date(2024, 5, 15, 0, 0, 0).getTime();
      const time = new Date(2024, 0, 1, 14, 30, 0).getTime();
      const result = DateUtil.ofDateAndTime(date, time);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
    });
  });

  describe('addDays', () => {
    it('should add days to a date', () => {
      const date = new Date(2024, 5, 15);
      const result = DateUtil.addDays(date, 3);
      expect(result.getDate()).toBe(18);
      expect(result.getMonth()).toBe(5);
    });

    it('should handle negative days (subtraction)', () => {
      const date = new Date(2024, 5, 15);
      DateUtil.addDays(date, -5);
      expect(date.getDate()).toBe(10);
    });

    it('should handle month boundaries', () => {
      const date = new Date(2024, 5, 30); // June 30
      DateUtil.addDays(date, 2);
      expect(date.getMonth()).toBe(6); // July
      expect(date.getDate()).toBe(2);
    });

    it('should return the same Date instance (mutates in place)', () => {
      const date = new Date(2024, 5, 15);
      const result = DateUtil.addDays(date, 1);
      expect(result).toBe(date);
    });
  });

  describe('convertFromNgbDateStruct', () => {
    it('should convert NgbDateStruct to a Date with correct year/month/day', () => {
      const struct = { year: 2024, month: 6, day: 15 };
      const result = DateUtil.convertFromNgbDateStruct(struct);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5); // 0-indexed
      expect(result.getDate()).toBe(15);
    });
  });
});
