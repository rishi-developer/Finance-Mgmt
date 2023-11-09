import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalGainRealizedReportComponent } from './capital-gain-realized-report.component';

describe('CapitalGainRealizedReportComponent', () => {
  let component: CapitalGainRealizedReportComponent;
  let fixture: ComponentFixture<CapitalGainRealizedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapitalGainRealizedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalGainRealizedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
