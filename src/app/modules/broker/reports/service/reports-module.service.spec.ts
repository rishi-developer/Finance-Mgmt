import { TestBed } from '@angular/core/testing';

import { ReportsModuleService } from './reports-module.service';

describe('ReportsModuleService', () => {
  let service: ReportsModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
