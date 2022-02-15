import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ExcelSheet} from '../../class/excel-sheet';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {ExcelRow} from "../../class/excel-row";

@Component({
  selector: 'ng-excel-viewer',
  templateUrl: './excel-viewer.component.html',
  styleUrls: ['./excel-viewer.component.scss']
})
export class ExcelViewerComponent implements OnInit {

  @ViewChild('gridHeader')
  gridHeaderRef: ElementRef | undefined;

  @ViewChild('gridFixedHeader')
  gridFixedHeaderRef: ElementRef | undefined;

  @ViewChild('scrollViewport')
  scrollViewport: CdkVirtualScrollViewport | undefined;

  @ViewChild('sheetNames')
  sheetNamesRef: ElementRef | undefined;

  @Input('selectMode') selectMode: boolean = false;
  @Output('selected') selected: EventEmitter<ExcelRow> = new EventEmitter<ExcelRow>();
  @Output('unSelected') unSelected: EventEmitter<ExcelRow> = new EventEmitter<ExcelRow>();


  excelData: ExcelSheet[] | undefined
  @Input('excelData')
  set setWorkBook(excelData: ExcelSheet[] | undefined) {
    this.excelData = excelData;
    console.log(excelData);
    if (this.selectMode && this.excelData) {
      this.excelData.forEach(sheet => {
        sheet.rows.forEach(row => {
          row.cells.forEach(cell => {
            if (cell.merge) {
              cell.cellStyle.height = cell.s_height + 'px';
            }
          })

        })
      })
    }
    setTimeout(() => {
      this.updateRowWidth();
    });
  }

  current = 0;

  defaultHeight = 25;
  fixedColumnWidth = 45;
  rowWidth = 0;

  itemSize = 15;
  virtualImageOffset = 0;

  constructor() { }

  ngOnInit(): void {
  }

  getRowStyle(rowType: string, row?: number) {
    if (!this.excelData) {
      return {};
    }
    const sheet = this.excelData[this.current];

    let height: number = 0;
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

  selectSheet(index: number) {
    this.current = index;
    this.updateRowWidth();
  }

  hasScrollForSheets() {
    if (!this.sheetNamesRef) {
      return false;
    }

    return this.sheetNamesRef.nativeElement.scrollWidth > this.sheetNamesRef.nativeElement.offsetWidth;
  }

  onScrollGrid(event: any) {
    // virtual image offset
    if (!this.scrollViewport || !this.excelData || !this.gridHeaderRef || !this.gridFixedHeaderRef) {
      return ;
    }

    const offset = this.scrollViewport['_renderedContentOffset'] || 0;
    const index = Math.round(offset / this.itemSize);
    if (!index) {
      this.virtualImageOffset = 0;
    } else {
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

  onClickRow(row: ExcelRow) {
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
    } else {
      this.unSelected.next(row);
    }
  }

}
