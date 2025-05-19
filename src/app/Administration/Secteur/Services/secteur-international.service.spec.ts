import { TestBed } from '@angular/core/testing';

import { SecteurInternationalService } from './secteur-international.service';

describe('SecteurInternationalService', () => {
  let service: SecteurInternationalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecteurInternationalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
