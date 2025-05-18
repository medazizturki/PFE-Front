import { TestBed } from '@angular/core/testing';

import { IndiceSectorielService } from './indice-sectoriel.service';

describe('IndiceSectorielService', () => {
  let service: IndiceSectorielService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndiceSectorielService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
