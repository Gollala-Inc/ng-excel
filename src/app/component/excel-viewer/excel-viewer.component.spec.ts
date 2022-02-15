import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelViewerComponent } from './excel-viewer.component';

describe('ExcelViewerComponent', () => {
  let component: ExcelViewerComponent;
  let fixture: ComponentFixture<ExcelViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
