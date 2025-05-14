import { TestBed } from '@angular/core/testing';

import { CommisionHorsElecService } from './commision-hors-elec.service';

describe('CommisionHorsElecService', () => {
  let service: CommisionHorsElecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommisionHorsElecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
