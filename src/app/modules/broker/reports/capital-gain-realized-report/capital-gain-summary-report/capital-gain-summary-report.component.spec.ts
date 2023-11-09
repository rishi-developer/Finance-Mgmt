import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalGainSummaryReportComponent } from './capital-gain-summary-report.component';

describe('CapitalGainSummaryReportComponent', () => {
  let component: CapitalGainSummaryReportComponent;
  let fixture: ComponentFixture<CapitalGainSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapitalGainSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalGainSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
