import { TestBed } from '@angular/core/testing';

import { TauxChargeService } from './taux-charge.service';

describe('TauxChargeService', () => {
  let service: TauxChargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TauxChargeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
