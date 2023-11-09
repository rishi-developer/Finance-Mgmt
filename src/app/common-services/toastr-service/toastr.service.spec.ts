import { TestBed } from '@angular/core/testing';

import {ToastrShowService} from './toastr.service'

describe('ToastrShowService', () => {
  let service: ToastrShowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrShowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
