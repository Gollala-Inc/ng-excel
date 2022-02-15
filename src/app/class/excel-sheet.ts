import {ExcelRow} from './excel-row';
import {Worksheet, Media, Workbook, ImageRange} from 'exceljs';
import {ExcelCell} from './excel-cell';

interface Cols {
  width: number;
  hidden: boolean;
  name: string;
}

interface Image {
  col1: number;
  col2: number;
  colOff1: number;
  colOff2: number;
  row1: number;
  row2: number;
  rowOff1: number;
  rowOff2: number;
  image: any;
  width: number;
  height: number;
  x: number;
  y: number;
  ext: any;
  styleExpression: any;
}

export class ExcelSheet {

  name: string = '';
  cols: Cols[] = [];
  rows: ExcelRow[] = [];
  rowCount: number = 0;
  images: Array<any> = [];


  constructor(private sheet: Worksheet, private workbook: Workbook, private media: any[]) {
    this.name = sheet.name;

    let maxColumns = 0;
    let maxRows = 0;


    const merges = (sheet as any)._merges;
    const mergeCell: any = {};
    Object.keys(merges).forEach(key => {
      const {left, right, top, bottom} = merges[key].model;

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
          width += (sheet.getColumn(i).width as number) || 8.34;
        }
      }
      for (let i = top; i <= bottom; i++) {
        if (!sheet.getRow(i).hidden) {
          height += (sheet.getRow(i).height as number) || 15;
          s_height += 23;
        }
      }
      mergeCell[key] = {
        width: width * 8,
        height: Math.round(height * 1.3),
        s_height: Math.round(s_height * 1.3)
      }
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
      if (maxRows < i+1) {
        maxRows = i+1;
      }
      const row = sheet.getRow(i+1);
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
        let s_height: number = Math.round(23 * 1.3);
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
      const {width, hidden} = sheet.getColumn(i);
      this.cols.push({
        width: (width || 8.34) * 8,
        hidden: hidden || false,
        name: this.getColumTitle(i - 1)
      });
    }

    // images 지금 상황에서 이미지 주문 고려안함, 차후 고려
    //this.getImages();
  }

  getColumTitle(index: number) {
    let title = '';
    if (Math.floor(index / 26) > 0) {
      title += String.fromCharCode(65 + Math.floor(index / 26) - 1);
    }

    title += String.fromCharCode(65 + index % 26);
    return title;
  }

  getImages() {
    const images: Image[] = [];
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
        ext: (img.range as any).ext,
        ...position
      })
    });
    this.images = images;
  }

  private getImagePosition(range: ImageRange) {
    const result = {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      styleExpression: {}
    }
    // 시작점 찾기
    let aaa = 0;
    for (let i = 0; i < range.tl.nativeCol; i++){
      if (!this.sheet.getColumn(i+1)?.hidden) {
        result.x += (this.sheet.getColumn(i+1)?.width || 8.34) * 8
        // border 가 있기 때문에 1픽셀식 추가
        if (i > 0) {
          result.x++;
        }
      }
    }
    for (let i = 0; i < range.tl.nativeRow; i++){
      if (!this.sheet.getRow(i+1)?.hidden) {
        result.y += Math.round((this.sheet.getRow(i+1).height || 15) * 1.3);
        // border 가 있기 때문에 1픽셀식 추가
        if (i > 0) {
          result.y++;
        }
      }
    }
    // 시작점 offset 추가
    result.x += range.tl.nativeColOff / 9525;
    result.y += range.tl.nativeRowOff / 9525;

    if ((range as any).ext) {
      result.width = (range as any).ext.width;
      result.height = (range as any).ext.height;
    } else {
      // 끝점 찾기
      for (let i = range.tl.nativeCol; i < range.br.nativeCol; i++) {
        result.width += (this.sheet.getColumn(i+1)?.width || 8.34) * 8
      }
      console.log('tl.nativeRow', range.tl.nativeRow);
      for (let i = range.tl.nativeRow; i < range.br.nativeRow; i++) {
        result.height += Math.round((this.sheet.getRow(i+1).height || 15) * 1.3);
      }
      // 끝점 offset 추가
      result.width += (range.br.nativeColOff / 9525) - (range.tl.nativeColOff / 9525);
      result.height += (range.br.nativeRowOff / 9525) - (range.tl.nativeRowOff / 9525);
    }

    result.styleExpression = {left: `${result.x}px`, top: `${result.y}px`, height: `${result.height}px`, width: `${result.width}px`};

    return result;
  }

  private getImage(imageId: number) {
    /*const buffer = this.workbook.getImage(imageId).buffer;
    // @ts-ignore
    return btoa(buffer.reduce((data, byte) => data + String.fromCharCode(byte), ''));*/
    return this.media[imageId].base64;
  }


}
