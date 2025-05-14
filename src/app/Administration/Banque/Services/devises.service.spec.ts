import { TestBed } from '@angular/core/testing';

import { DevisesService } from './devises.service';

describe('DevisesService', () => {
  let service: DevisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
