import { Component } from '@angular/core';
import {ExcelService} from './service/excel.service';
import {ExcelRow} from "./class/excel-row";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-excel-app';

  excelData: any;

  constructor(
    private excelService: ExcelService
  ) {
  }


  readExcel(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    this.excelService.getFileToData(target.files[0]).subscribe(data => {
      this.excelData = data;
    });
    /*const workbook = new Workbook();
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    /!**
     * Final Solution For Importing the Excel FILE
     *!/

    const arryBuffer = new Response(target.files[0]).arrayBuffer();
    arryBuffer.then( (data) => {
      workbook.xlsx.load(data)
        .then( () => {

          // play with workbook and worksheet now
          this.excelData = workbook;
        });
    });*/
  }

  aa(event: any) {
    console.log(event);
  }

  bb(event: any) {
    console.log(event);
  }
}
