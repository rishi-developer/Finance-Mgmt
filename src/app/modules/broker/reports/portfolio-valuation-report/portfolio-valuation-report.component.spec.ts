import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioValuationReportComponent } from './portfolio-valuation-report.component';

describe('PortfolioValuationReportComponent', () => {
  let component: PortfolioValuationReportComponent;
  let fixture: ComponentFixture<PortfolioValuationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortfolioValuationReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioValuationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
