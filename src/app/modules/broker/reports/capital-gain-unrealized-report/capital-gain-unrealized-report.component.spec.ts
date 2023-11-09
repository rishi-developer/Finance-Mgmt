import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapitalGainUnrealizedReportComponent } from './capital-gain-unrealized-report.component';

describe('CapitalGainUnrealizedReportComponent', () => {
  let component: CapitalGainUnrealizedReportComponent;
  let fixture: ComponentFixture<CapitalGainUnrealizedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapitalGainUnrealizedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalGainUnrealizedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
