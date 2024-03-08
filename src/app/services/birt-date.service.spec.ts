import { TestBed } from '@angular/core/testing';

import { BirtDateService } from './birt-date.service';

describe('BirtDateService', () => {
  let service: BirtDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BirtDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
