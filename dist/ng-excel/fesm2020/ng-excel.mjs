import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Component, ViewChild, Input, Output, NgModule } from '@angular/core';
import { Workbook } from 'exceljs';
import { Observable } from 'rxjs';
import * as i1 from '@angular/cdk/scrolling';
import { ScrollingModule } from '@angular/cdk/scrolling';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';

class ExcelRow {
    constructor(rowNumber, hidden, height, cells, row) {
        this.row = row;
        this.rowNumber = 0;
        this.height = 0;
        this.hidden = false;
        this.cells = [];
        this.selected = false;
        this.rowNumber = rowNumber;
        this.hidden = hidden;
        this.height = height;
        this.cells = cells;
    }
    get values() {
        return this.row.values;
    }
}

const indexcedColors = {
    '0': '#FF000000',
    '1': '#FFFFFFFF',
    '2': '#FFFF0000',
    '3': '#FF00FF00',
    '4': '#FF0000FF',
    '5': '#FFFFFF00',
    '6': '#FFFF00FF',
    '7': '#FF00FFFF',
    '8': '#FF000000',
    '9': '#FFFFFFFF',
    '10': '#FFFF0000',
    '11': '#FF00FF00',
    '12': '#FF0000FF',
    '13': '#FFFFFF00',
    '14': '#FFFF00FF',
    '15': '#FF00FFFF',
    '16': '#FF800000',
    '17': '#FF008000',
    '18': '#FF000080',
    '19': '#FF808000',
    '20': '#FF800080',
    '21': '#FF008080',
    '22': '#FFC0C0C0',
    '23': '#FF808080',
    '24': '#FF9999FF',
    '25': '#FF993366',
    '26': '#FFFFFFCC',
    '27': '#FFCCFFFF',
    '28': '#FF660066',
    '29': '#FFFF8080',
    '30': '#FF0066CC',
    '31': '#FFCCCCFF',
    '32': '#FF000080',
    '33': '#FFFF00FF',
    '34': '#FFFFFF00',
    '35': '#FF00FFFF',
    '36': '#FF800080',
    '37': '#FF800000',
    '38': '#FF008080',
    '39': '#FF0000FF',
    '40': '#FF00CCFF',
    '41': '#FFCCFFFF',
    '42': '#FFCCFFCC',
    '43': '#FFFFFF99',
    '44': '#FF99CCFF',
    '45': '#FFFF99CC',
    '46': '#FFCC99FF',
    '47': '#FFFFCC99',
    '48': '#FF3366FF',
    '49': '#FF33CCCC',
    '50': '#FF99CC00',
    '51': '#FFFFCC00',
    '52': '#FFFF9900',
    '53': '#FFFF6600',
    '54': '#FF666699',
    '55': '#FF969696',
    '56': '#FF003366',
    '57': '#FF339966',
    '58': '#FF003300',
    '59': '#FF333300',
    '60': '#FF993300',
    '61': '#FF993366',
    '62': '#FF333399',
    '63': '#FF333333',
};
const themes = ['#FFFFFF', '#000000', '#E7E6E6', '#44546A', '#5B9BD5', '#ED7D31', '#A5A5A5', '#FFC000', '#4472C4', '#70AD47'];
class ExcelCell {
    constructor(address, cellNumber, height, style, width, value, merge, s_height) {
        this.merge = false;
        this.address = address;
        this.cellNumber = cellNumber;
        this.height = height;
        this.style = style;
        this.width = width;
        this.value = value;
        this.merge = merge;
        this.s_height = s_height;
        this.getCellStyle();
        this.getCellValue();
    }
    getCellStyle() {
        const { style } = this;
        const result = {};
        if (style) {
            if (style.font?.size) {
                result['font-size'] = `${style.font.size}px`;
            }
            if (style.font?.bold) {
                result['font-weight'] = 'bold';
            }
            if (style.font?.color?.argb) {
                result['color'] = `#${style.font.color.argb.slice(-6)}`;
            }
            if (typeof this.value === 'number') {
                result['justify-content'] = 'flex-end';
            }
            if (style.alignment) {
                const alignment = {
                    middle: 'center',
                    center: 'center',
                    top: 'flex-start',
                    bottom: 'flex-end',
                    left: 'flex-start',
                    right: 'flex-end'
                };
                if (style.alignment.vertical) {
                    result['align-items'] = alignment[style.alignment.vertical];
                }
                if (style.alignment.horizontal) {
                    result['justify-content'] = alignment[style.alignment.horizontal];
                }
            }
            if (style.fill?.color?.indexed < 64) {
                const index = (style.fill?.color?.indexed || 0).toString();
                result['background'] = indexcedColors[index];
            }
            if (style.fill?.fgColor?.argb) {
                result['background'] = `#${style.fill.fgColor.argb.slice(-6)}`;
            }
            if (style.fill?.fgColor?.theme) {
                result['background'] = this.getTintColor(themes[style.fill.fgColor.theme], style.fill.fgColor.tint || 0);
            }
        }
        if (this.merge) {
            result['width'] = this.width + 'px';
            result['height'] = this.height + 'px' || '100%';
            result['z-index'] = 1;
            if (!result.background) {
                result['background'] = '#fff';
            }
        }
        this.cellStyle = result;
    }
    getCellValue() {
        if (typeof this.value === 'object' && this.value.richText) {
            return this.cellValue = this.value.richText.map((d) => d.text);
        }
        return this.cellValue = this.value;
    }
    getTintColor(hex, tint) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });
        const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!rgb) {
            return null;
        }
        const r = parseInt(rgb[1], 16);
        const g = parseInt(rgb[2], 16);
        const b = parseInt(rgb[3], 16);
        if (tint >= 0) {
            return this.rgbToHex(r + ((255 - r) * tint), g + ((255 - g) * tint), b + ((255 - b) * tint));
        }
        else {
            return this.rgbToHex(r * (1 - (tint * -1)), g * (1 - (tint * -1)), b * (1 - (tint * -1)));
        }
    }
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
    }
}

class ExcelSheet {
    constructor(sheet, workbook, media) {
        this.sheet = sheet;
        this.workbook = workbook;
        this.media = media;
        this.name = '';
        this.cols = [];
        this.rows = [];
        this.rowCount = 0;
        this.images = [];
        this.name = sheet.name;
        let maxColumns = 0;
        let maxRows = 0;
        const merges = sheet._merges;
        const mergeCell = {};
        Object.keys(merges).forEach(key => {
            const { left, right, top, bottom } = merges[key].model;
            // maxColumns
            if (maxColumns < right) {
                maxColumns = right;
            }
            // maxRows
            if (maxRows < bottom) {
                maxRows = bottom;
            }
            // merge cell의 witdh, heigt 구하기
            let width = 0;
            let height = 0;
            let s_height = 0;
            for (let i = left; i <= right; i++) {
                if (!sheet.getColumn(i).hidden) {
                    width += sheet.getColumn(i).width || 8.34;
                }
            }
            for (let i = top; i <= bottom; i++) {
                if (!sheet.getRow(i).hidden) {
                    height += sheet.getRow(i).height || 15;
                    s_height += 23;
                }
            }
            mergeCell[key] = {
                width: width * 8,
                height: Math.round(height * 1.3),
                s_height: Math.round(s_height * 1.3)
            };
        });
        // rows
        /*sheet.eachRow((row, rowNumber) => {
          if (maxRows < rowNumber) {
            maxRows = rowNumber;
          }
          const cells: ExcelCell[] = [];
          for (let i = 1; i <= row.cellCount; i++) {
            if (maxColumns < i) {
              maxColumns = i;
            }
            let merge = false;
            let cell = (row.getCell(i).model as any);
            const cellNumber = i;
            let width: number = (sheet.getColumn(i).width || 8.34) * 8;
            let height: number = Math.round((row.height || 15) * 1.3);
            if (mergeCell[cell.address]) {
              width = mergeCell[cell.address].width;
              height = mergeCell[cell.address].height;
              merge = true;
            }
            const excelCell = new ExcelCell(cell.address, cellNumber, height, cell.style, width, cell.value, merge);
            cells.push(excelCell);
          }
    
          this.rows.push(new ExcelRow(rowNumber, row.hidden, Math.round((row.height || 15) * 1.3), cells));
          this.rowCount++;
        });*/
        for (let i = 0; i < sheet.rowCount; i++) {
            if (maxRows < i + 1) {
                maxRows = i + 1;
            }
            const row = sheet.getRow(i + 1);
            const cells = [];
            for (let i = 1; i <= row.cellCount; i++) {
                if (maxColumns < i) {
                    maxColumns = i;
                }
                let merge = false;
                let cell = row.getCell(i).model;
                const cellNumber = i;
                let width = (sheet.getColumn(i).width || 8.34) * 8;
                let height = Math.round((row.height || 15) * 1.3);
                let s_height = Math.round(23 * 1.3);
                if (mergeCell[cell.address]) {
                    width = mergeCell[cell.address].width;
                    height = mergeCell[cell.address].height;
                    s_height = mergeCell[cell.address].s_height;
                    merge = true;
                }
                const excelCell = new ExcelCell(cell.address, cellNumber, height, cell.style, width, cell.value, merge, s_height);
                cells.push(excelCell);
            }
            this.rows.push(new ExcelRow(i, row.hidden, Math.round((row.height || 15) * 1.3), cells, row));
            this.rowCount++;
        }
        // cols
        for (let i = 1; i <= sheet.columnCount; i++) {
            const { width, hidden } = sheet.getColumn(i);
            this.cols.push({
                width: (width || 8.34) * 8,
                hidden: hidden || false,
                name: this.getColumTitle(i - 1)
            });
        }
        // images 지금 상황에서 이미지 주문 고려안함, 차후 고려
        //this.getImages();
    }
    getColumTitle(index) {
        let title = '';
        if (Math.floor(index / 26) > 0) {
            title += String.fromCharCode(65 + Math.floor(index / 26) - 1);
        }
        title += String.fromCharCode(65 + index % 26);
        return title;
    }
    getImages() {
        const images = [];
        this.sheet.getImages().forEach(img => {
            const position = this.getImagePosition(img.range);
            images.push({
                col1: img.range.tl?.nativeCol,
                col2: img.range.br?.nativeCol,
                colOff1: img.range.tl?.nativeColOff,
                colOff2: img.range.br?.nativeColOff,
                row1: img.range.tl?.nativeRow,
                row2: img.range.br?.nativeRow,
                rowOff1: img.range.tl?.nativeRowOff,
                rowOff2: img.range.br?.nativeRowOff,
                image: this.getImage(+img.imageId),
                ext: img.range.ext,
                ...position
            });
        });
        this.images = images;
    }
    getImagePosition(range) {
        const result = {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            styleExpression: {}
        };
        // 시작점 찾기
        let aaa = 0;
        for (let i = 0; i < range.tl.nativeCol; i++) {
            if (!this.sheet.getColumn(i + 1)?.hidden) {
                result.x += (this.sheet.getColumn(i + 1)?.width || 8.34) * 8;
                // border 가 있기 때문에 1픽셀식 추가
                if (i > 0) {
                    result.x++;
                }
            }
        }
        for (let i = 0; i < range.tl.nativeRow; i++) {
            if (!this.sheet.getRow(i + 1)?.hidden) {
                result.y += Math.round((this.sheet.getRow(i + 1).height || 15) * 1.3);
                // border 가 있기 때문에 1픽셀식 추가
                if (i > 0) {
                    result.y++;
                }
            }
        }
        // 시작점 offset 추가
        result.x += range.tl.nativeColOff / 9525;
        result.y += range.tl.nativeRowOff / 9525;
        if (range.ext) {
            result.width = range.ext.width;
            result.height = range.ext.height;
        }
        else {
            // 끝점 찾기
            for (let i = range.tl.nativeCol; i < range.br.nativeCol; i++) {
                result.width += (this.sheet.getColumn(i + 1)?.width || 8.34) * 8;
            }
            console.log('tl.nativeRow', range.tl.nativeRow);
            for (let i = range.tl.nativeRow; i < range.br.nativeRow; i++) {
                result.height += Math.round((this.sheet.getRow(i + 1).height || 15) * 1.3);
            }
            // 끝점 offset 추가
            result.width += (range.br.nativeColOff / 9525) - (range.tl.nativeColOff / 9525);
            result.height += (range.br.nativeRowOff / 9525) - (range.tl.nativeRowOff / 9525);
        }
        result.styleExpression = { left: `${result.x}px`, top: `${result.y}px`, height: `${result.height}px`, width: `${result.width}px` };
        return result;
    }
    getImage(imageId) {
        /*const buffer = this.workbook.getImage(imageId).buffer;
        // @ts-ignore
        return btoa(buffer.reduce((data, byte) => data + String.fromCharCode(byte), ''));*/
        return this.media[imageId].base64;
    }
}

class NgExcelService {
    constructor() { }
    getFileToData(file) {
        const workbook = new Workbook();
        const images = [];
        const arryBuffer = new Response(file).arrayBuffer();
        return new Observable(subscriber => {
            try {
                arryBuffer.then((data) => {
                    workbook.xlsx.load(data)
                        .then(() => {
                        // 이미지 buffer to base64, 현재 상황에서 이미지 주분 고려 안함
                        /*const media = (workbook as any).media;
                        media.forEach((image: any) => {
                          const img = {
                            ...image,
                            base64: this.getImage(image.buffer)
                          };
                          images.push(img);
                        });
                        */
                        const sheets = [];
                        workbook.worksheets.forEach(sheet => {
                            sheets.push(new ExcelSheet(sheet, workbook, images));
                        });
                        subscriber.next(sheets);
                        subscriber.complete();
                    });
                });
            }
            catch (err) {
                subscriber.error(err);
            }
        });
    }
    getImage(buffer) {
        // @ts-ignore
        return btoa(buffer.reduce((data, byte) => data + String.fromCharCode(byte), ''));
    }
}
NgExcelService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: NgExcelService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgExcelService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: NgExcelService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: NgExcelService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class ExcelViewerComponent {
    constructor() {
        this.selectMode = false;
        this.selected = new EventEmitter();
        this.unSelected = new EventEmitter();
        this.current = 0;
        this.defaultHeight = 25;
        this.fixedColumnWidth = 45;
        this.rowWidth = 0;
        this.itemSize = 15;
        this.virtualImageOffset = 0;
    }
    set setWorkBook(excelData) {
        this.excelData = excelData;
        console.log(excelData);
        if (this.selectMode && this.excelData) {
            this.excelData.forEach(sheet => {
                sheet.rows.forEach(row => {
                    row.cells.forEach(cell => {
                        if (cell.merge) {
                            cell.cellStyle.height = cell.s_height + 'px';
                        }
                    });
                });
            });
        }
        setTimeout(() => {
            this.updateRowWidth();
        });
    }
    ngOnInit() {
    }
    getRowStyle(rowType, row) {
        if (!this.excelData) {
            return {};
        }
        const sheet = this.excelData[this.current];
        let height = 0;
        const rows = sheet.rows;
        if (rowType === 'header' || !rows[row || 0]['height']) {
            height = this.defaultHeight;
        }
        else {
            height = rows[row || 0]['height'];
        }
        return {
            width: `${this.rowWidth}px`,
            height: `${this.selectMode ? '30' : height}px`,
        };
    }
    updateRowWidth() {
        if (!this.excelData || !this.excelData[this.current] || !this.scrollViewport) {
            return;
        }
        let width = this.fixedColumnWidth;
        const cols = this.excelData[this.current].cols;
        for (let c = 0; c < cols.length; c++) {
            width += cols[c].width ? cols[c].width + 1 : 100;
        }
        this.rowWidth = width;
    }
    selectSheet(index) {
        this.current = index;
        this.updateRowWidth();
    }
    hasScrollForSheets() {
        if (!this.sheetNamesRef) {
            return false;
        }
        return this.sheetNamesRef.nativeElement.scrollWidth > this.sheetNamesRef.nativeElement.offsetWidth;
    }
    onScrollGrid(event) {
        // virtual image offset
        if (!this.scrollViewport || !this.excelData || !this.gridHeaderRef || !this.gridFixedHeaderRef) {
            return;
        }
        const offset = this.scrollViewport['_renderedContentOffset'] || 0;
        const index = Math.round(offset / this.itemSize);
        if (!index) {
            this.virtualImageOffset = 0;
        }
        else {
            let rowHeight = 0;
            for (let i = 0; i < index; i++) {
                const os = this.itemSize - this.excelData[this.current].rows[i].height;
                rowHeight += os;
            }
            this.virtualImageOffset = rowHeight - offset;
        }
        // scroll left
        const scrollLeft = event.target.scrollLeft;
        if (!scrollLeft) {
            this.gridHeaderRef.nativeElement.style.transform = `translateX(0px)`;
            this.gridFixedHeaderRef.nativeElement.style.transform = `translateX(0px)`;
            return;
        }
        this.gridHeaderRef.nativeElement.style.transform = `translateX(-${scrollLeft}px)`;
        this.gridFixedHeaderRef.nativeElement.style.transform = `translateX(${scrollLeft}px)`;
    }
    onClickRow(row) {
        if (!this.selectMode || !this.excelData) {
            return;
        }
        const selected = row.selected;
        this.excelData[this.current].rows.forEach(row => {
            row.selected = false;
        });
        row.selected = !selected;
        if (row.selected) {
            this.selected.next(row);
        }
        else {
            this.unSelected.next(row);
        }
    }
}
ExcelViewerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ExcelViewerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
ExcelViewerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.1.3", type: ExcelViewerComponent, selector: "ng-excel-viewer", inputs: { selectMode: "selectMode", setWorkBook: ["excelData", "setWorkBook"] }, outputs: { selected: "selected", unSelected: "unSelected" }, viewQueries: [{ propertyName: "gridHeaderRef", first: true, predicate: ["gridHeader"], descendants: true }, { propertyName: "gridFixedHeaderRef", first: true, predicate: ["gridFixedHeader"], descendants: true }, { propertyName: "scrollViewport", first: true, predicate: ["scrollViewport"], descendants: true }, { propertyName: "sheetNamesRef", first: true, predicate: ["sheetNames"], descendants: true }], ngImport: i0, template: "<div class=\"component-wrap\" [ngClass]=\"{'select-mode': selectMode}\" *ngIf=\"excelData && excelData[current]\">\r\n  <div class=\"grid-header\">\r\n    <div class=\"row\" #gridHeader [ngStyle]=\"getRowStyle('header')\">\r\n      <div class=\"cell fixed\" #gridFixedHeader></div>\r\n      <div class=\"cell\" *ngFor=\"let col of excelData[current].cols\" [style.width.px]=\"col.width\">\r\n        {{col.name}}\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"grid-body\" [ngClass]=\"{'withScroll': hasScrollForSheets()}\">\r\n    <cdk-virtual-scroll-viewport class=\"grid-body-viewport\"\r\n                                 [itemSize]=\"itemSize\" [minBufferPx]=\"500\" [maxBufferPx]=\"500\"\r\n                                 (scroll)=\"onScrollGrid($event)\"\r\n                                 #scrollViewport>\r\n      <!--\uD604\uC7AC \uC0C1\uD669\uC5D0\uC11C \uC774\uBBF8\uC9C0 \uACE0\uB824 \uC548\uD568, \uB2E4\uC74C\uC73C\uB85C -->\r\n      <!--<div class=\"img-wrap\" [style.transform]=\"'translate(45px, ' + virtualImageOffset + 'px)'\">\r\n        <div class=\"image\" *ngFor=\"let img of excelData[current].images\" [ngStyle]=\"img.styleExpression\">\r\n          <img [src]=\"'data:image/png;base64,' + img.image\">\r\n        </div>\r\n      </div>-->\r\n      <ng-container *cdkVirtualFor=\"let row of excelData[current].rows; let r = index; templateCacheSize: 0;\">\r\n        <div *ngIf=\"!row.hidden\" class=\"row\" [ngStyle]=\"getRowStyle('data', r || 0)\" (click)=\"onClickRow(row)\">\r\n          <div class=\"hover-border\" [ngClass]=\"{'active': row.selected}\">\r\n            <div class=\"selected\">\r\n              <svg width=\"13\" height=\"10\" viewBox=\"0 0 13 10\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n                <path d=\"M11.8899 1.13993C11.7947 1.04768 11.6674 0.996094 11.5349 0.996094C11.4024 0.996094 11.2751 1.04768 11.1799 1.13993L5.87988 6.48993C5.8334 6.5368 5.77815 6.57399 5.71722 6.59938C5.65629 6.62476 5.59091 6.63783 5.5249 6.63783C5.4589 6.63783 5.39357 6.62476 5.33264 6.59938C5.27171 6.57399 5.2164 6.5368 5.16992 6.48993L2.54993 3.84993C2.50345 3.80307 2.44814 3.76587 2.38721 3.74049C2.32628 3.7151 2.26089 3.70203 2.19489 3.70203C2.12888 3.70203 2.06355 3.7151 2.00262 3.74049C1.94169 3.76587 1.88639 3.80307 1.8399 3.84993L1.13989 4.54993C1.04764 4.64508 0.996094 4.7724 0.996094 4.90493C0.996094 5.03746 1.04764 5.16478 1.13989 5.25993L5.13989 9.31993C5.23504 9.41218 5.36241 9.46377 5.49493 9.46377C5.62746 9.46377 5.75476 9.41218 5.84991 9.31993L12.5599 2.54993C12.6515 2.45647 12.7028 2.33081 12.7028 2.19993C12.7028 2.06905 12.6515 1.9434 12.5599 1.84993L11.8899 1.13993Z\" fill=\"white\"/>\r\n              </svg>\r\n            </div>\r\n          </div>\r\n          <div class=\"cell fixed\">\r\n            <div class=\"cell-item\" [innerHTML]=\"(r + 1)\"></div>\r\n          </div>\r\n          <div class=\"cell\" *ngFor=\"let cell of row.cells; let c = index\"\r\n               [style.width.px]=\"excelData[current].cols[c]?.width || 0\">\r\n            <div class=\"cell-item\" [innerHTML]=\"cell.cellValue\" [ngStyle]=\"cell.cellStyle\"></div>\r\n          </div>\r\n        </div>\r\n      </ng-container>\r\n    </cdk-virtual-scroll-viewport>\r\n  </div>\r\n  <div class=\"grid-footer\" *ngIf=\"!selectMode\">\r\n    <ul class=\"sheets\" #sheetNames>\r\n      <li *ngFor=\"let sheet of excelData; let i = index\" [ngClass]=\"i === current ? 'selected' : ''\" (click)=\"selectSheet(i)\">\r\n        {{ sheet.name }}\r\n      </li>\r\n    </ul>\r\n  </div>\r\n\r\n</div>\r\n<table >\r\n\r\n</table>\r\n", styles: [":host{height:100%;width:-moz-fit-content;width:fit-content;display:inline-block}.component-wrap{height:100%;overflow:hidden;display:flex;flex-direction:column}.component-wrap.select-mode{max-width:1032px;height:305px;padding-left:40px;padding-right:2px;max-height:100%}.component-wrap.select-mode cdk-virtual-scroll-viewport{overflow:visible;contain:initial;z-index:11}.component-wrap.select-mode cdk-virtual-scroll-viewport ::ng-deep .cdk-virtual-scroll-content-wrapper{contain:inherit}.component-wrap.select-mode .grid-body .row{position:relative}.component-wrap.select-mode .grid-body .row:hover .hover-border{display:block;cursor:pointer}.component-wrap.select-mode .grid-body .row .hover-border{display:none;position:absolute;left:-2px;top:-2px;width:100%;height:100%;border:2px solid #EE2554;max-width:1032px;z-index:11;border-radius:4px}.component-wrap.select-mode .grid-body .row .hover-border.active{display:block;background:#ee25541a}.component-wrap.select-mode .grid-body .row .hover-border.active .selected{display:flex}.component-wrap.select-mode .grid-body .row .hover-border .selected{position:absolute;width:24px;height:24px;left:-40px;top:3px;border:1px solid #CC1F46;box-sizing:border-box;border-radius:12px;background:#EE2554;display:none;align-items:center;justify-content:center}.component-wrap .row{display:inline-block;border-bottom:1px solid #ddd}.component-wrap .row .hover-border{display:none}.component-wrap .row .cell{position:relative;height:100%;display:inline-block}.component-wrap .row .cell.fixed{width:45px;position:sticky;left:0;float:left;z-index:10}.component-wrap .row .cell.fixed .cell-item{display:flex;align-items:center;justify-content:center;background:#f6f6f6;font-size:13px}.component-wrap .row .cell .cell-item{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;padding:3px;box-sizing:border-box}.component-wrap .row .cell+.cell{border-left:1px solid #eee}.component-wrap .grid-header{justify-content:center;overflow:hidden;height:25px}.component-wrap .grid-header .row{color:#757575;height:24px!important}.component-wrap .grid-header .row .fixed{background:#f6f6f6}.component-wrap .grid-header .row .cell{white-space:nowrap;text-align:center;background:#f6f6f6;font-size:13px;line-height:25px;border-bottom:1px solid #ddd}.component-wrap .grid-body{height:calc(100% - 50px);flex:1}.component-wrap .grid-body .grid-body-viewport{height:100%}.component-wrap .grid-body .grid-body-viewport .no-order{background-color:#ff5d5d!important;color:#fff}.component-wrap .grid-body .grid-body-viewport .no-order:hover{background-color:#ff2f2a!important}.component-wrap .grid-body .grid-body-viewport ::ng-deep .cdk-virtual-scroll-content-wrapper{display:inline-grid}.component-wrap .grid-body .img-wrap{position:relative;transform:translate(45px);z-index:10}.component-wrap .grid-body .img-wrap .image{position:absolute;z-index:50}.component-wrap .grid-body .img-wrap .image img{width:100%;height:100%}.component-wrap .grid-body.withScroll{height:calc(100% - 65px)}.component-wrap .grid-footer{height:25px;background-color:#eee}.component-wrap .grid-footer .sheets{margin:0;list-style:none;padding:0 0 0 30px;white-space:nowrap;overflow-x:scroll}.component-wrap .grid-footer .sheets>li{display:inline-block;padding:3px 15px;border-right:solid 1px #ddd;font-size:12px;cursor:pointer}.component-wrap .grid-footer .sheets>li:first-child{border-left:solid 1px #ddd}.component-wrap .grid-footer .sheets>li.selected{border-bottom:solid 3px #1f6e39;background-color:#fff;cursor:default}\n"], components: [{ type: i1.CdkVirtualScrollViewport, selector: "cdk-virtual-scroll-viewport", inputs: ["orientation", "appendOnly"], outputs: ["scrolledIndexChange"] }], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.CdkFixedSizeVirtualScroll, selector: "cdk-virtual-scroll-viewport[itemSize]", inputs: ["itemSize", "minBufferPx", "maxBufferPx"] }, { type: i1.CdkVirtualForOf, selector: "[cdkVirtualFor][cdkVirtualForOf]", inputs: ["cdkVirtualForOf", "cdkVirtualForTrackBy", "cdkVirtualForTemplate", "cdkVirtualForTemplateCacheSize"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: ExcelViewerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-excel-viewer', template: "<div class=\"component-wrap\" [ngClass]=\"{'select-mode': selectMode}\" *ngIf=\"excelData && excelData[current]\">\r\n  <div class=\"grid-header\">\r\n    <div class=\"row\" #gridHeader [ngStyle]=\"getRowStyle('header')\">\r\n      <div class=\"cell fixed\" #gridFixedHeader></div>\r\n      <div class=\"cell\" *ngFor=\"let col of excelData[current].cols\" [style.width.px]=\"col.width\">\r\n        {{col.name}}\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"grid-body\" [ngClass]=\"{'withScroll': hasScrollForSheets()}\">\r\n    <cdk-virtual-scroll-viewport class=\"grid-body-viewport\"\r\n                                 [itemSize]=\"itemSize\" [minBufferPx]=\"500\" [maxBufferPx]=\"500\"\r\n                                 (scroll)=\"onScrollGrid($event)\"\r\n                                 #scrollViewport>\r\n      <!--\uD604\uC7AC \uC0C1\uD669\uC5D0\uC11C \uC774\uBBF8\uC9C0 \uACE0\uB824 \uC548\uD568, \uB2E4\uC74C\uC73C\uB85C -->\r\n      <!--<div class=\"img-wrap\" [style.transform]=\"'translate(45px, ' + virtualImageOffset + 'px)'\">\r\n        <div class=\"image\" *ngFor=\"let img of excelData[current].images\" [ngStyle]=\"img.styleExpression\">\r\n          <img [src]=\"'data:image/png;base64,' + img.image\">\r\n        </div>\r\n      </div>-->\r\n      <ng-container *cdkVirtualFor=\"let row of excelData[current].rows; let r = index; templateCacheSize: 0;\">\r\n        <div *ngIf=\"!row.hidden\" class=\"row\" [ngStyle]=\"getRowStyle('data', r || 0)\" (click)=\"onClickRow(row)\">\r\n          <div class=\"hover-border\" [ngClass]=\"{'active': row.selected}\">\r\n            <div class=\"selected\">\r\n              <svg width=\"13\" height=\"10\" viewBox=\"0 0 13 10\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\r\n                <path d=\"M11.8899 1.13993C11.7947 1.04768 11.6674 0.996094 11.5349 0.996094C11.4024 0.996094 11.2751 1.04768 11.1799 1.13993L5.87988 6.48993C5.8334 6.5368 5.77815 6.57399 5.71722 6.59938C5.65629 6.62476 5.59091 6.63783 5.5249 6.63783C5.4589 6.63783 5.39357 6.62476 5.33264 6.59938C5.27171 6.57399 5.2164 6.5368 5.16992 6.48993L2.54993 3.84993C2.50345 3.80307 2.44814 3.76587 2.38721 3.74049C2.32628 3.7151 2.26089 3.70203 2.19489 3.70203C2.12888 3.70203 2.06355 3.7151 2.00262 3.74049C1.94169 3.76587 1.88639 3.80307 1.8399 3.84993L1.13989 4.54993C1.04764 4.64508 0.996094 4.7724 0.996094 4.90493C0.996094 5.03746 1.04764 5.16478 1.13989 5.25993L5.13989 9.31993C5.23504 9.41218 5.36241 9.46377 5.49493 9.46377C5.62746 9.46377 5.75476 9.41218 5.84991 9.31993L12.5599 2.54993C12.6515 2.45647 12.7028 2.33081 12.7028 2.19993C12.7028 2.06905 12.6515 1.9434 12.5599 1.84993L11.8899 1.13993Z\" fill=\"white\"/>\r\n              </svg>\r\n            </div>\r\n          </div>\r\n          <div class=\"cell fixed\">\r\n            <div class=\"cell-item\" [innerHTML]=\"(r + 1)\"></div>\r\n          </div>\r\n          <div class=\"cell\" *ngFor=\"let cell of row.cells; let c = index\"\r\n               [style.width.px]=\"excelData[current].cols[c]?.width || 0\">\r\n            <div class=\"cell-item\" [innerHTML]=\"cell.cellValue\" [ngStyle]=\"cell.cellStyle\"></div>\r\n          </div>\r\n        </div>\r\n      </ng-container>\r\n    </cdk-virtual-scroll-viewport>\r\n  </div>\r\n  <div class=\"grid-footer\" *ngIf=\"!selectMode\">\r\n    <ul class=\"sheets\" #sheetNames>\r\n      <li *ngFor=\"let sheet of excelData; let i = index\" [ngClass]=\"i === current ? 'selected' : ''\" (click)=\"selectSheet(i)\">\r\n        {{ sheet.name }}\r\n      </li>\r\n    </ul>\r\n  </div>\r\n\r\n</div>\r\n<table >\r\n\r\n</table>\r\n", styles: [":host{height:100%;width:-moz-fit-content;width:fit-content;display:inline-block}.component-wrap{height:100%;overflow:hidden;display:flex;flex-direction:column}.component-wrap.select-mode{max-width:1032px;height:305px;padding-left:40px;padding-right:2px;max-height:100%}.component-wrap.select-mode cdk-virtual-scroll-viewport{overflow:visible;contain:initial;z-index:11}.component-wrap.select-mode cdk-virtual-scroll-viewport ::ng-deep .cdk-virtual-scroll-content-wrapper{contain:inherit}.component-wrap.select-mode .grid-body .row{position:relative}.component-wrap.select-mode .grid-body .row:hover .hover-border{display:block;cursor:pointer}.component-wrap.select-mode .grid-body .row .hover-border{display:none;position:absolute;left:-2px;top:-2px;width:100%;height:100%;border:2px solid #EE2554;max-width:1032px;z-index:11;border-radius:4px}.component-wrap.select-mode .grid-body .row .hover-border.active{display:block;background:#ee25541a}.component-wrap.select-mode .grid-body .row .hover-border.active .selected{display:flex}.component-wrap.select-mode .grid-body .row .hover-border .selected{position:absolute;width:24px;height:24px;left:-40px;top:3px;border:1px solid #CC1F46;box-sizing:border-box;border-radius:12px;background:#EE2554;display:none;align-items:center;justify-content:center}.component-wrap .row{display:inline-block;border-bottom:1px solid #ddd}.component-wrap .row .hover-border{display:none}.component-wrap .row .cell{position:relative;height:100%;display:inline-block}.component-wrap .row .cell.fixed{width:45px;position:sticky;left:0;float:left;z-index:10}.component-wrap .row .cell.fixed .cell-item{display:flex;align-items:center;justify-content:center;background:#f6f6f6;font-size:13px}.component-wrap .row .cell .cell-item{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;padding:3px;box-sizing:border-box}.component-wrap .row .cell+.cell{border-left:1px solid #eee}.component-wrap .grid-header{justify-content:center;overflow:hidden;height:25px}.component-wrap .grid-header .row{color:#757575;height:24px!important}.component-wrap .grid-header .row .fixed{background:#f6f6f6}.component-wrap .grid-header .row .cell{white-space:nowrap;text-align:center;background:#f6f6f6;font-size:13px;line-height:25px;border-bottom:1px solid #ddd}.component-wrap .grid-body{height:calc(100% - 50px);flex:1}.component-wrap .grid-body .grid-body-viewport{height:100%}.component-wrap .grid-body .grid-body-viewport .no-order{background-color:#ff5d5d!important;color:#fff}.component-wrap .grid-body .grid-body-viewport .no-order:hover{background-color:#ff2f2a!important}.component-wrap .grid-body .grid-body-viewport ::ng-deep .cdk-virtual-scroll-content-wrapper{display:inline-grid}.component-wrap .grid-body .img-wrap{position:relative;transform:translate(45px);z-index:10}.component-wrap .grid-body .img-wrap .image{position:absolute;z-index:50}.component-wrap .grid-body .img-wrap .image img{width:100%;height:100%}.component-wrap .grid-body.withScroll{height:calc(100% - 65px)}.component-wrap .grid-footer{height:25px;background-color:#eee}.component-wrap .grid-footer .sheets{margin:0;list-style:none;padding:0 0 0 30px;white-space:nowrap;overflow-x:scroll}.component-wrap .grid-footer .sheets>li{display:inline-block;padding:3px 15px;border-right:solid 1px #ddd;font-size:12px;cursor:pointer}.component-wrap .grid-footer .sheets>li:first-child{border-left:solid 1px #ddd}.component-wrap .grid-footer .sheets>li.selected{border-bottom:solid 3px #1f6e39;background-color:#fff;cursor:default}\n"] }]
        }], ctorParameters: function () { return []; }, propDecorators: { gridHeaderRef: [{
                type: ViewChild,
                args: ['gridHeader']
            }], gridFixedHeaderRef: [{
                type: ViewChild,
                args: ['gridFixedHeader']
            }], scrollViewport: [{
                type: ViewChild,
                args: ['scrollViewport']
            }], sheetNamesRef: [{
                type: ViewChild,
                args: ['sheetNames']
            }], selectMode: [{
                type: Input,
                args: ['selectMode']
            }], selected: [{
                type: Output,
                args: ['selected']
            }], unSelected: [{
                type: Output,
                args: ['unSelected']
            }], setWorkBook: [{
                type: Input,
                args: ['excelData']
            }] } });

class NgExcelModule {
}
NgExcelModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: NgExcelModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgExcelModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: NgExcelModule, declarations: [ExcelViewerComponent], imports: [ScrollingModule,
        CommonModule], exports: [ExcelViewerComponent] });
NgExcelModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: NgExcelModule, imports: [[
            ScrollingModule,
            CommonModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.3", ngImport: i0, type: NgExcelModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        ExcelViewerComponent,
                    ],
                    imports: [
                        ScrollingModule,
                        CommonModule
                    ],
                    exports: [
                        ExcelViewerComponent,
                    ]
                }]
        }] });

/*
 * Public API Surface of ng-excel
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ExcelViewerComponent, NgExcelModule, NgExcelService };
//# sourceMappingURL=ng-excel.mjs.map
