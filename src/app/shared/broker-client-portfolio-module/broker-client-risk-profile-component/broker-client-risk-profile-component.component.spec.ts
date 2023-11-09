import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerClientRiskProfileComponentComponent } from './broker-client-risk-profile-component.component';

describe('BrokerClientRiskProfileComponentComponent', () => {
  let component: BrokerClientRiskProfileComponentComponent;
  let fixture: ComponentFixture<BrokerClientRiskProfileComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerClientRiskProfileComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerClientRiskProfileComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
