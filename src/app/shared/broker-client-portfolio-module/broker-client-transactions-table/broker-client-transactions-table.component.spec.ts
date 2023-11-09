import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerClientTransactionsTableComponent } from './broker-client-transactions-table.component';

describe('BrokerClientTransactionsTableComponent', () => {
  let component: BrokerClientTransactionsTableComponent;
  let fixture: ComponentFixture<BrokerClientTransactionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerClientTransactionsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerClientTransactionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
