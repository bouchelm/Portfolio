import { TestBed } from '@angular/core/testing';

import { OpenRouteServiceService } from './open-route-service.service';

describe('OpenRouteServiceService', () => {
  let service: OpenRouteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenRouteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
