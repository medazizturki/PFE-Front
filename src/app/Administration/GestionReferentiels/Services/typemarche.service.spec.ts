import { TestBed } from '@angular/core/testing';

import { TypemarcheService } from './typemarche.service';

describe('TypemarcheService', () => {
  let service: TypemarcheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypemarcheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
