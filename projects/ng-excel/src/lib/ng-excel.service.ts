import { Injectable } from '@angular/core';
import {Workbook} from "exceljs";
import {Observable} from "rxjs";
import {ExcelSheet} from "./class/excel-sheet";

@Injectable({
  providedIn: 'root'
})
export class NgExcelService {

  constructor() { }

  getFileToData(file: any) {
    const workbook = new Workbook();
    const images: any[] = [];
    const arryBuffer = new Response(file).arrayBuffer();
    return new Observable(subscriber => {
      try {
        arryBuffer.then( (data) => {
          workbook.xlsx.load(data)
            .then( () => {

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

              const sheets: ExcelSheet[] = [];
              workbook.worksheets.forEach(sheet => {
                sheets.push(new ExcelSheet(sheet, workbook, images));
              });
              subscriber.next(sheets);
              subscriber.complete();
            });
        });
      } catch (err) {
        subscriber.error(err);
      }
    })

  }

  private getImage(buffer: any[]) {
    // @ts-ignore
    return btoa(buffer.reduce((data, byte) => data + String.fromCharCode(byte), ''));
  }
}
