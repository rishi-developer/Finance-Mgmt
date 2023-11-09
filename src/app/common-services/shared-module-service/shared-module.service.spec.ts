import { TestBed } from '@angular/core/testing';

import { SharedModuleService } from './shared-module.service';

describe('SharedModuleService', () => {
  let service: SharedModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
