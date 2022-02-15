import { ExcelCell } from './excel-cell';
export declare class ExcelRow {
    private row;
    rowNumber: number;
    height: number;
    hidden: boolean;
    cells: ExcelCell[];
    selected: boolean;
    constructor(rowNumber: number, hidden: boolean, height: number, cells: ExcelCell[], row: any);
    get values(): any;
}
