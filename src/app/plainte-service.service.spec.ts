import { TestBed } from '@angular/core/testing';

import { PlainteServiceService } from './plainte-service.service';

describe('PlainteServiceService', () => {
  let service: PlainteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlainteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
