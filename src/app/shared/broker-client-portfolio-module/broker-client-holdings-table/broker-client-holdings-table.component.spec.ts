import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerClientHoldingsTableComponent } from './broker-client-holdings-table.component';

describe('BrokerClientHoldingsTableComponent', () => {
  let component: BrokerClientHoldingsTableComponent;
  let fixture: ComponentFixture<BrokerClientHoldingsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerClientHoldingsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerClientHoldingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
