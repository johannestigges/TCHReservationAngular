import { TableCell } from './table-cell';

/**
 *generic table data
 */
export class TableData {

  private table_rows = 0;
  private table_columns = 0;
  table: TableCell[][] = [];

  /**
   * set the data for one cell
   *
   * @param row
   * @param column
   * @param data
   * @param rowspan
   * @param colspan
   */
  setCell(row: number, column: number, rowspan: number = 1, colspan: number = 1) {
    while (row >= this.table_rows) {
      this.newRow();
    }
    while (column >= this.table_columns) {
      this.newColumn();
    }
    this.setRowspan(row, column, rowspan, colspan);
    this.setColspan(row, column, rowspan, colspan);
  }

  setData(row: number, column: number, data: any) {
    this.table[row][column].data = data;
  }

  clearAll() {
    this.table_rows = 0;
    this.table_columns = 0;
    this.table = [];
  }

  private newRow() {
    this.table[this.table_rows] = [];
    for (let column = 0; column < this.table_columns; column++) {
      this.table[this.table_rows][column] = new TableCell();
    }
    this.table_rows++;
  }

  private newColumn() {
    for (let row = 0; row < this.table_rows; row++) {
      this.table[row][this.table_columns] = new TableCell();
    }
    this.table_columns++;
  }

  private setRowspan(row: number, column: number, rowspan: number, colspan: number) {
    this.table[row][column].rowspan = rowspan;
    for (let i = 1; i < rowspan; i++) {
      this.setCell(row + i, column, 0, colspan);
    }
    if (rowspan > 0) {
      for (let i = 0; i < row; i++) {
        if (this.table[i][column] && this.table[i][column].rowspan > row - i) {
          this.table[i][column].rowspan = row - i;
        }
      }
    }
  }

  private setColspan(row: number, column: number, rowspan: number, colspan: number) {
    this.table[row][column].colspan = colspan;
    for (let i = 1; i < colspan; i++) {
      this.setCell(row, column + i, rowspan, 0);
    }
    if (colspan > 0) {
      for (let i = 0; i < column; i++) {
        if (this.table[row][i] && this.table[row][i].colspan > column - i) {
          this.table[row][i].colspan = column - i;
        }
      }
    }
  }
}
