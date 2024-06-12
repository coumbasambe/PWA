  // data.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { PlainteService } from '../services/plainte.service';

describe('PlainteService', () => {
  let service: PlainteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlainteService],
    });
    service = TestBed.get(PlainteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get data', () => {
    const data = service.getPlaintes();
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });

  it('should save data', () => {
    const testData = {
        objet: 'Test',
        description: 'Description Test',
        dateReception:'2024-01-10T08:00:04.000+00:00',
        statutId: '657313e9ca0a183cc4d3cede'
    };

    service.postPlainte(testData);
    const data = service.getPlaintes();
    expect(data.length).toBe(1);
    expect(data[0]).toBe(testData);
  });
});
