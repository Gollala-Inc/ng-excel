export declare class ExcelCell {
    address: string | undefined;
    cellNumber: number | undefined;
    height: number | undefined;
    s_height: number | undefined;
    style: any | undefined;
    width: number | undefined;
    value: any | undefined;
    merge: boolean;
    cellStyle: any;
    cellValue: any | undefined;
    constructor(address: string | undefined, cellNumber: number | undefined, height: number | undefined, style: any | undefined, width: number | undefined, value: string | undefined, merge: boolean, s_height: number | undefined);
    getCellStyle(): void;
    getCellValue(): any;
    private getTintColor;
    private rgbToHex;
}
