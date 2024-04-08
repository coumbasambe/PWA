import { TestBed } from '@angular/core/testing';

import { QosUniverseServiceService } from './qos-universe-service.service';

describe('QosUniverseServiceService', () => {
  let service: QosUniverseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QosUniverseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
