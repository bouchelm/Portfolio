import { TestBed } from '@angular/core/testing';

import { ChargerDonneesService } from './charger-donnees.service';

describe('ChargerDonneesService', () => {
  let service: ChargerDonneesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargerDonneesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
