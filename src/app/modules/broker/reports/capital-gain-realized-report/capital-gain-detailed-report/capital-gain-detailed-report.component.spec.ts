import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalGainDetailedReportComponent } from './capital-gain-detailed-report.component';

describe('CapitalGainDetailedReportComponent', () => {
  let component: CapitalGainDetailedReportComponent;
  let fixture: ComponentFixture<CapitalGainDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapitalGainDetailedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalGainDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
