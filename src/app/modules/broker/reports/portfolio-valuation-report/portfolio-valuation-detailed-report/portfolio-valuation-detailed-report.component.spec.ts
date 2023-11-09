import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioValuationDetailedReportComponent } from './portfolio-valuation-detailed-report.component';

describe('PortfolioValuationDetailedReportComponent', () => {
  let component: PortfolioValuationDetailedReportComponent;
  let fixture: ComponentFixture<PortfolioValuationDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioValuationDetailedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioValuationDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
