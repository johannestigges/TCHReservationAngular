import { TableCell } from './table-cell';

/**
 * generic table data
 */
export class TableData {
	private tableRows = 0;
	private tableColumns = 0;
	table: TableCell[][] = [];

	/**
   * set the data for one cell
   */
	setCell(row: number, column: number, rowspan = 1, colspan = 1) {
		while (row >= this.tableRows) {
			this.newRow();
		}
		while (column >= this.tableColumns) {
			this.newColumn();
		}
		this.setRowspan(row, column, rowspan, colspan);
		this.setColspan(row, column, rowspan, colspan);
	}

	setData(row: number, column: number, data: unknown) {
		const cell = this.getCell(row, column);
		if (cell != null) {
			cell.data = data;
		}
	}

	clearAll() {
		this.tableRows = 0;
		this.tableColumns = 0;
		this.table = [];
	}

	getRows() {
		return this.tableRows;
	}

	getColums() {
		return this.tableColumns;
	}

	getCell(row: number, column: number): TableCell | null {
		if (row > this.getRows() || column > this.getColums()) {
			return null;
		}
		return this.table[row][column];
	}

	private newRow() {
		this.table[this.tableRows] = [];
		for (let column = 0; column < this.tableColumns; column++) {
			this.table[this.tableRows][column] = new TableCell();
		}
		this.tableRows++;
	}

	private newColumn() {
		for (let row = 0; row < this.tableRows; row++) {
			this.table[row][this.tableColumns] = new TableCell();
		}
		this.tableColumns++;
	}

	private setRowspan(
		row: number,
		column: number,
		rowspan: number,
		colspan: number
	) {
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

	private setColspan(
		row: number,
		column: number,
		rowspan: number,
		colspan: number
	) {
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
