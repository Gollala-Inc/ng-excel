import { Injectable } from '@angular/core';
import { Workbook } from "exceljs";
import { Observable } from "rxjs";
import { ExcelSheet } from "./class/excel-sheet";
import * as i0 from "@angular/core";
export class NgExcelService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctZXhjZWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWV4Y2VsL3NyYy9saWIvbmctZXhjZWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDakMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNoQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0scUJBQXFCLENBQUM7O0FBSy9DLE1BQU0sT0FBTyxjQUFjO0lBRXpCLGdCQUFnQixDQUFDO0lBRWpCLGFBQWEsQ0FBQyxJQUFTO1FBQ3JCLE1BQU0sUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7UUFDaEMsTUFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sVUFBVSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BELE9BQU8sSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDakMsSUFBSTtnQkFDRixVQUFVLENBQUMsSUFBSSxDQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7b0JBQ3hCLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzt5QkFDckIsSUFBSSxDQUFFLEdBQUcsRUFBRTt3QkFFViw2Q0FBNkM7d0JBQzdDOzs7Ozs7OzswQkFRRTt3QkFFRixNQUFNLE1BQU0sR0FBaUIsRUFBRSxDQUFDO3dCQUNoQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTs0QkFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ3ZELENBQUMsQ0FBQyxDQUFDO3dCQUNILFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3hCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDeEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUM7YUFDSjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdkI7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUVKLENBQUM7SUFFTyxRQUFRLENBQUMsTUFBYTtRQUM1QixhQUFhO1FBQ2IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbkYsQ0FBQzs7MkdBM0NVLGNBQWM7K0dBQWQsY0FBYyxjQUZiLE1BQU07MkZBRVAsY0FBYztrQkFIMUIsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7V29ya2Jvb2t9IGZyb20gXCJleGNlbGpzXCI7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSBcInJ4anNcIjtcclxuaW1wb3J0IHtFeGNlbFNoZWV0fSBmcm9tIFwiLi9jbGFzcy9leGNlbC1zaGVldFwiO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTmdFeGNlbFNlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICBnZXRGaWxlVG9EYXRhKGZpbGU6IGFueSkge1xyXG4gICAgY29uc3Qgd29ya2Jvb2sgPSBuZXcgV29ya2Jvb2soKTtcclxuICAgIGNvbnN0IGltYWdlczogYW55W10gPSBbXTtcclxuICAgIGNvbnN0IGFycnlCdWZmZXIgPSBuZXcgUmVzcG9uc2UoZmlsZSkuYXJyYXlCdWZmZXIoKTtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhcnJ5QnVmZmVyLnRoZW4oIChkYXRhKSA9PiB7XHJcbiAgICAgICAgICB3b3JrYm9vay54bHN4LmxvYWQoZGF0YSlcclxuICAgICAgICAgICAgLnRoZW4oICgpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgLy8g7J2066+47KeAIGJ1ZmZlciB0byBiYXNlNjQsIO2YhOyerCDsg4Htmansl5DshJwg7J2066+47KeAIOyjvOu2hCDqs6DroKQg7JWI7ZWoXHJcbiAgICAgICAgICAgICAgLypjb25zdCBtZWRpYSA9ICh3b3JrYm9vayBhcyBhbnkpLm1lZGlhO1xyXG4gICAgICAgICAgICAgIG1lZGlhLmZvckVhY2goKGltYWdlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGltZyA9IHtcclxuICAgICAgICAgICAgICAgICAgLi4uaW1hZ2UsXHJcbiAgICAgICAgICAgICAgICAgIGJhc2U2NDogdGhpcy5nZXRJbWFnZShpbWFnZS5idWZmZXIpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgaW1hZ2VzLnB1c2goaW1nKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgICBjb25zdCBzaGVldHM6IEV4Y2VsU2hlZXRbXSA9IFtdO1xyXG4gICAgICAgICAgICAgIHdvcmtib29rLndvcmtzaGVldHMuZm9yRWFjaChzaGVldCA9PiB7XHJcbiAgICAgICAgICAgICAgICBzaGVldHMucHVzaChuZXcgRXhjZWxTaGVldChzaGVldCwgd29ya2Jvb2ssIGltYWdlcykpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChzaGVldHMpO1xyXG4gICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEltYWdlKGJ1ZmZlcjogYW55W10pIHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHJldHVybiBidG9hKGJ1ZmZlci5yZWR1Y2UoKGRhdGEsIGJ5dGUpID0+IGRhdGEgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGUpLCAnJykpO1xyXG4gIH1cclxufVxyXG4iXX0=