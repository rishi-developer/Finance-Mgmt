import { TestBed } from '@angular/core/testing';

import { RelationshipManagerService } from './relationship-manager.service';

describe('RelationshipManagerService', () => {
  let service: RelationshipManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelationshipManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
