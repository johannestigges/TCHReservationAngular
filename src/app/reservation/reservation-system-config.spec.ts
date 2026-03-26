import { ReservationSystemConfig, SystemConfigReservationType } from './reservation-system-config';
import { DateUtil } from '../util/date/date-util';

describe('ReservationSystemConfig', () => {
  let config: ReservationSystemConfig;

  beforeEach(() => {
    // 3 courts, 30-min slots, opens 08:00, closes 22:00
    config = new ReservationSystemConfig(
      1, 'tc-test', 'TC Test', ['Court 1', 'Court 2', 'Court 3'],
      30, 14, 4, 8, 22, []
    );
  });

  describe('EMPTY', () => {
    it('should be a config with id 0 and empty courts', () => {
      expect(ReservationSystemConfig.EMPTY.id).toBe(0);
      expect(ReservationSystemConfig.EMPTY.courts).toEqual([]);
    });
  });

  describe('of', () => {
    it('should return a new instance with the same field values', () => {
      const copy = ReservationSystemConfig.of(config);
      expect(copy).not.toBe(config);
      expect(copy.id).toBe(config.id);
      expect(copy.name).toBe(config.name);
      expect(copy.openingHour).toBe(config.openingHour);
      expect(copy.courts).toBe(config.courts); // same array reference
    });
  });

  describe('getCourtIndices', () => {
    it('should return [0, 1, 2] for 3 courts', () => {
      expect(config.getCourtIndices()).toEqual([0, 1, 2]);
    });

    it('should return [] for no courts', () => {
      const empty = new ReservationSystemConfig(1, '', '', [], 30, 14, 4, 8, 22, []);
      expect(empty.getCourtIndices()).toEqual([]);
    });
  });

  describe('getCourtName', () => {
    it('should return the correct court name by index', () => {
      expect(config.getCourtName(0)).toBe('Court 1');
      expect(config.getCourtName(2)).toBe('Court 3');
    });
  });

  describe('getRows', () => {
    it('should be (closingHour - openingHour) * 60 / durationUnit', () => {
      // (22 - 8) * 60 / 30 = 28
      expect(config.getRows()).toBe(28);
    });

    it('should work with 60-minute slots', () => {
      const c = new ReservationSystemConfig(1, '', '', [], 60, 14, 4, 9, 21, []);
      expect(c.getRows()).toBe(12);
    });

    it('should work with 15-minute slots', () => {
      const c = new ReservationSystemConfig(1, '', '', [], 15, 14, 4, 8, 9, []);
      expect(c.getRows()).toBe(4);
    });
  });

  describe('toMinutes', () => {
    it('row 0 should be openingHour * 60', () => {
      expect(config.toMinutes(0)).toBe(8 * 60);
    });

    it('row 1 should be openingHour * 60 + durationUnitInMinutes', () => {
      expect(config.toMinutes(1)).toBe(8 * 60 + 30);
    });

    it('row 4 should be openingHour * 60 + 4 * durationUnitInMinutes', () => {
      expect(config.toMinutes(4)).toBe(8 * 60 + 4 * 30);
    });
  });

  describe('toRow', () => {
    it('should return 0 for a date at opening time', () => {
      const date = new Date(2024, 5, 15, 8, 0, 0);
      expect(config.toRow(date.getTime())).toBe(0);
    });

    it('should return 1 for a date 30 minutes after opening', () => {
      const date = new Date(2024, 5, 15, 8, 30, 0);
      expect(config.toRow(date.getTime())).toBe(1);
    });

    it('should return 4 for a date 2 hours after opening', () => {
      const date = new Date(2024, 5, 15, 10, 0, 0);
      expect(config.toRow(date.getTime())).toBe(4);
    });
  });

  describe('getEnd', () => {
    it('should add 1 duration unit to date + start', () => {
      const date = new Date(2024, 5, 15, 0, 0, 0).getTime();
      const start = 8 * DateUtil.HOUR;
      const end = config.getEnd(date, start, 1);
      expect(end).toBe(date + start + 30 * DateUtil.MINUTE);
    });

    it('should handle multiple duration units', () => {
      const date = new Date(2024, 5, 15, 0, 0, 0).getTime();
      const start = 10 * DateUtil.HOUR;
      const end = config.getEnd(date, start, 2);
      expect(end).toBe(date + start + 60 * DateUtil.MINUTE);
    });
  });

  describe('getDurationDefault', () => {
    it('should return 1 when durationUnitInMinutes is 60', () => {
      const c = new ReservationSystemConfig(1, '', '', [], 60, 14, 4, 8, 22, []);
      expect(c.getDurationDefault()).toBe(1);
    });

    it('should return 2 when durationUnitInMinutes is 30', () => {
      expect(config.getDurationDefault()).toBe(2);
    });

    it('should return 2 when durationUnitInMinutes is 15', () => {
      const c = new ReservationSystemConfig(1, '', '', [], 15, 14, 4, 8, 22, []);
      expect(c.getDurationDefault()).toBe(2);
    });
  });
});

describe('SystemConfigReservationType', () => {
  describe('of', () => {
    it('should create a copy with the same field values', () => {
      const original = new SystemConfigReservationType(
        1, 2, 'Match', 4, 14, 24, true, false, ['SATURDAY'], 'bold', ['REGISTERED']
      );
      const copy = SystemConfigReservationType.of(original);
      expect(copy).not.toBe(original);
      expect(copy.id).toBe(1);
      expect(copy.name).toBe('Match');
      expect(copy.repeatable).toBeTrue();
      expect(copy.roles).toEqual(['REGISTERED']);
    });
  });

  describe('default constructor', () => {
    it('should initialise with sensible defaults', () => {
      const type = new SystemConfigReservationType();
      expect(type.id).toBeNull();
      expect(type.name).toBe('');
      expect(type.forbiddenDaysOfWeek).toEqual([]);
      expect(type.roles).toEqual([]);
      expect(type.repeatable).toBeFalse();
    });
  });
});
