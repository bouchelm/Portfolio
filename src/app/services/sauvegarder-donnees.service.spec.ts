import { TestBed } from '@angular/core/testing';

import { SauvegarderDonneesService } from './sauvegarder-donnees.service';

describe('SauvegarderDonneesService', () => {
  let service: SauvegarderDonneesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SauvegarderDonneesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
