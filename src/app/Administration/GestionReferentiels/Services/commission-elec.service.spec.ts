import { TestBed } from '@angular/core/testing';

import { CommissionElecService } from './commission-elec.service';

describe('CommissionElecService', () => {
  let service: CommissionElecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommissionElecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
