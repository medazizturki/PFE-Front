import { TestBed } from '@angular/core/testing';

import { TypeTeneurService } from './type-teneur.service';

describe('TypeTeneurService', () => {
  let service: TypeTeneurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeTeneurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
