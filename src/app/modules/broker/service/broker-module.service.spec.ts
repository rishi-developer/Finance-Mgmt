import { TestBed } from '@angular/core/testing';

import { BrokerModuleService } from './broker-module.service';

describe('BrokerModuleService', () => {
  let service: BrokerModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
