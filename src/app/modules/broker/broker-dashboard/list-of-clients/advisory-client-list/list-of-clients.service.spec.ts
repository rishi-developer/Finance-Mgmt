import { TestBed } from '@angular/core/testing';

import { ListOfClientsService } from '../services/list-of-clients.service';

describe('ListOfClientsService', () => {
  let service: ListOfClientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListOfClientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
