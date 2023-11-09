import { TestBed } from '@angular/core/testing';

import { SideBarToggleService } from './side-bar-toggle.service';

describe('SideBarToggleService', () => {
  let service: SideBarToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideBarToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
