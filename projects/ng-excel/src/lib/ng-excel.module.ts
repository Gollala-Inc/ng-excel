import { NgModule } from '@angular/core';
import {ExcelViewerComponent} from "./component/excel-viewer/excel-viewer.component";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {CommonModule} from "@angular/common";



@NgModule({
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
})
export class NgExcelModule { }
