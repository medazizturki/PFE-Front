import { TestBed } from '@angular/core/testing';

import { IntermediaireService } from './intermediaire.service';

describe('IntermediaireService', () => {
  let service: IntermediaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntermediaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
