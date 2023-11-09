import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerFreshTransactionComponent } from './broker-fresh-transaction.component';

describe('BrokerFreshTransactionComponent', () => {
  let component: BrokerFreshTransactionComponent;
  let fixture: ComponentFixture<BrokerFreshTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerFreshTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerFreshTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
