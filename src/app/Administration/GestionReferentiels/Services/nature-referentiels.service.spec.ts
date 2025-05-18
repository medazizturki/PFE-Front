import { TestBed } from '@angular/core/testing';

import { NatureReferentielsService } from './nature-referentiels.service';

describe('NatureReferentielsService', () => {
  let service: NatureReferentielsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NatureReferentielsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
