import { TestBed } from '@angular/core/testing';

import { TMMService } from './tmm.service';

describe('TMMService', () => {
  let service: TMMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TMMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
