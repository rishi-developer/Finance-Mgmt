import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskProfileResultComponent } from './risk-profile-result.component';

describe('RiskProfileResultComponent', () => {
  let component: RiskProfileResultComponent;
  let fixture: ComponentFixture<RiskProfileResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskProfileResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskProfileResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
