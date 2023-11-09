import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioPerformanceReportComponent } from './portfolio-performance-report.component';

describe('PortfolioPerformanceReportComponent', () => {
  let component: PortfolioPerformanceReportComponent;
  let fixture: ComponentFixture<PortfolioPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioPerformanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
