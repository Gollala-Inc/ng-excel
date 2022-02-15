import { TestBed } from '@angular/core/testing';

import { NgExcelService } from './ng-excel.service';

describe('NgExcelService', () => {
  let service: NgExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
