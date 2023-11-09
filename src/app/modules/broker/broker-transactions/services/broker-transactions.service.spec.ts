import { TestBed } from '@angular/core/testing';

import { BrokerTransactionsService } from './broker-transactions.service';

describe('BrokerTransactionsService', () => {
  let service: BrokerTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
