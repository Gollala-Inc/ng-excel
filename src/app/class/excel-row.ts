import {ExcelCell} from './excel-cell';
import {Row} from 'exceljs';

export class ExcelRow {

  rowNumber: number = 0;
  height: number = 0;
  hidden: boolean = false;
  cells: ExcelCell[] = [];
  selected: boolean = false;

  constructor(rowNumber: number, hidden: boolean, height: number, cells: ExcelCell[], private row: Row) {
    this.rowNumber = rowNumber;
    this.hidden = hidden;
    this.height = height;
    this.cells = cells;
  }

  public values() {
    return this.row.values;
  }
}
