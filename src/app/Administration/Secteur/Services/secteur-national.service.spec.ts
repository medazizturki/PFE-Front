import { TestBed } from '@angular/core/testing';

import { SecteurNationalService } from './secteur-national.service';

describe('SecteurNationalService', () => {
  let service: SecteurNationalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecteurNationalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
