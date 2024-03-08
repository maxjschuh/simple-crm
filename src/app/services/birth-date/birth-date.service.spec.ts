import { TestBed } from '@angular/core/testing';

import { BirthDateService } from './birth-date.service';

describe('BirthDateService', () => {
  let service: BirthDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BirthDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
