import { ExcelRow } from './excel-row';
import { Worksheet, Workbook } from 'exceljs';
interface Cols {
    width: number;
    hidden: boolean;
    name: string;
}
export declare class ExcelSheet {
    private sheet;
    private workbook;
    private media;
    name: string;
    cols: Cols[];
    rows: ExcelRow[];
    rowCount: number;
    images: Array<any>;
    constructor(sheet: Worksheet, workbook: Workbook, media: any[]);
    getColumTitle(index: number): string;
    getImages(): void;
    private getImagePosition;
    private getImage;
}
export {};
