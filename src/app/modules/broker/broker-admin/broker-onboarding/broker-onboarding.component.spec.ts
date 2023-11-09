import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerOnboardingComponent } from './broker-onboarding.component';

describe('BrokerOnboardingComponent', () => {
  let component: BrokerOnboardingComponent;
  let fixture: ComponentFixture<BrokerOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerOnboardingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
