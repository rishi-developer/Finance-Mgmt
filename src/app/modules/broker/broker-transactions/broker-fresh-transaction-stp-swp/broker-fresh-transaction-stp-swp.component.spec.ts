import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerFreshTransactionStpSwpComponent } from './broker-fresh-transaction-stp-swp.component';

describe('BrokerFreshTransactionStpSwpComponent', () => {
  let component: BrokerFreshTransactionStpSwpComponent;
  let fixture: ComponentFixture<BrokerFreshTransactionStpSwpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerFreshTransactionStpSwpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerFreshTransactionStpSwpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
