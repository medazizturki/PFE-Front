import { TestBed } from '@angular/core/testing';

import { CategorieavoirService } from './categorieavoir.service';

describe('CategorieavoirService', () => {
  let service: CategorieavoirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorieavoirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
