import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerAdditionalTransactionComponent } from './broker-additional-transaction.component';

describe('BrokerAdditionalTransactionComponent', () => {
  let component: BrokerAdditionalTransactionComponent;
  let fixture: ComponentFixture<BrokerAdditionalTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerAdditionalTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerAdditionalTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
