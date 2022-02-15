import { ElementRef, EventEmitter, OnInit } from '@angular/core';
import { ExcelSheet } from '../../class/excel-sheet';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ExcelRow } from "../../class/excel-row";
import * as i0 from "@angular/core";
export declare class ExcelViewerComponent implements OnInit {
    gridHeaderRef: ElementRef | undefined;
    gridFixedHeaderRef: ElementRef | undefined;
    scrollViewport: CdkVirtualScrollViewport | undefined;
    sheetNamesRef: ElementRef | undefined;
    selectMode: boolean;
    selected: EventEmitter<ExcelRow>;
    unSelected: EventEmitter<ExcelRow>;
    excelData: ExcelSheet[] | undefined;
    set setWorkBook(excelData: ExcelSheet[] | undefined);
    current: number;
    defaultHeight: number;
    fixedColumnWidth: number;
    rowWidth: number;
    itemSize: number;
    virtualImageOffset: number;
    constructor();
    ngOnInit(): void;
    getRowStyle(rowType: string, row?: number): {
        width?: undefined;
        height?: undefined;
    } | {
        width: string;
        height: string;
    };
    updateRowWidth(): void;
    selectSheet(index: number): void;
    hasScrollForSheets(): boolean;
    onScrollGrid(event: any): void;
    onClickRow(row: ExcelRow): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExcelViewerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ExcelViewerComponent, "ng-excel-viewer", never, { "selectMode": "selectMode"; "setWorkBook": "excelData"; }, { "selected": "selected"; "unSelected": "unSelected"; }, never, never>;
}
