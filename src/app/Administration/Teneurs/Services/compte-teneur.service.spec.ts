import { TestBed } from '@angular/core/testing';

import { CompteTeneurService } from './compte-teneur.service';

describe('CompteTeneurService', () => {
  let service: CompteTeneurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompteTeneurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
