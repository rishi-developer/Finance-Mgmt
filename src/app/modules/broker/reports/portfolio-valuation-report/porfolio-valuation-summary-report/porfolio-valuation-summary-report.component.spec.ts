import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorfolioValuationSummaryReportComponent } from './porfolio-valuation-summary-report.component';

describe('PorfolioValuationSummaryReportComponent', () => {
  let component: PorfolioValuationSummaryReportComponent;
  let fixture: ComponentFixture<PorfolioValuationSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PorfolioValuationSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PorfolioValuationSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
