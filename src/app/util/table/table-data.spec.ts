import { TableData } from './table-data';
import { TableCell } from './table-cell';

describe('TableData', () => {
  let td: TableData<string>;

  beforeEach(() => {
    td = new TableData<string>();
  });

  describe('initial state', () => {
    it('should have 0 rows and 0 columns', () => {
      expect(td.getRows()).toBe(0);
      expect(td.getColums()).toBe(0);
    });

    it('should have an empty table array', () => {
      expect(td.table).toEqual([]);
    });
  });

  describe('setCell', () => {
    it('should grow table to fit row 0, column 0', () => {
      td.setCell(0, 0);
      expect(td.getRows()).toBe(1);
      expect(td.getColums()).toBe(1);
    });

    it('should grow table to fit non-adjacent indices', () => {
      td.setCell(2, 3);
      expect(td.getRows()).toBe(3);
      expect(td.getColums()).toBe(4);
    });

    it('should default rowspan and colspan to 1', () => {
      td.setCell(0, 0);
      const cell = td.getCell(0, 0);
      expect(cell?.rowspan).toBe(1);
      expect(cell?.colspan).toBe(1);
    });

    it('should apply custom rowspan and colspan', () => {
      td.setCell(0, 0, 3, 2);
      expect(td.getCell(0, 0)?.rowspan).toBe(3);
      expect(td.getCell(0, 0)?.colspan).toBe(2);
    });

    it('should mark cells covered by rowspan with rowspan=0', () => {
      td.setCell(0, 0, 3, 1);
      expect(td.getCell(1, 0)?.rowspan).toBe(0);
      expect(td.getCell(2, 0)?.rowspan).toBe(0);
    });

    it('should mark cells covered by colspan with colspan=0', () => {
      td.setCell(0, 0, 1, 3);
      expect(td.getCell(0, 1)?.colspan).toBe(0);
      expect(td.getCell(0, 2)?.colspan).toBe(0);
    });

    it('should clip an existing rowspan when a new cell is placed in its path', () => {
      td.setCell(0, 0, 3, 1); // spans rows 0-2
      td.setCell(1, 0, 1, 1); // placed at row 1, col 0 → clips span of row 0
      expect(td.getCell(0, 0)?.rowspan).toBe(1);
    });

    it('should clip an existing colspan when a new cell is placed in its path', () => {
      td.setCell(0, 0, 1, 3); // spans cols 0-2
      td.setCell(0, 1, 1, 1); // placed at col 1 → clips span of col 0
      expect(td.getCell(0, 0)?.colspan).toBe(1);
    });
  });

  describe('setData', () => {
    it('should set data on an existing cell', () => {
      td.setCell(0, 0);
      td.setData(0, 0, 'hello');
      expect(td.getCell(0, 0)?.data).toBe('hello');
    });

    it('should not throw for an out-of-bounds position', () => {
      expect(() => td.setData(99, 99, 'x')).not.toThrow();
    });
  });

  describe('getCell', () => {
    it('should return the cell at a valid position', () => {
      td.setCell(1, 2);
      expect(td.getCell(1, 2)).toBeInstanceOf(TableCell);
    });

    it('should return null for a row beyond the table', () => {
      td.setCell(0, 0);
      expect(td.getCell(5, 0)).toBeNull();
    });

    it('should return null for a column beyond the table', () => {
      td.setCell(0, 0);
      expect(td.getCell(0, 5)).toBeNull();
    });
  });

  describe('clearAll', () => {
    it('should reset the table to an empty state', () => {
      td.setCell(2, 2);
      td.setData(1, 1, 'something');
      td.clearAll();
      expect(td.getRows()).toBe(0);
      expect(td.getColums()).toBe(0);
      expect(td.table).toEqual([]);
    });

    it('should allow adding cells again after clearing', () => {
      td.setCell(2, 2);
      td.clearAll();
      td.setCell(0, 0);
      expect(td.getRows()).toBe(1);
      expect(td.getColums()).toBe(1);
    });
  });

  describe('multi-cell grid', () => {
    it('should build a 2x2 grid correctly', () => {
      td.setCell(0, 0);
      td.setCell(0, 1);
      td.setCell(1, 0);
      td.setCell(1, 1);
      expect(td.getRows()).toBe(2);
      expect(td.getColums()).toBe(2);
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
          expect(td.getCell(r, c)).toBeInstanceOf(TableCell);
        }
      }
    });
  });
});
