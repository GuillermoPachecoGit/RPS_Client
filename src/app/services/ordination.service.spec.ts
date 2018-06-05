import { TestBed, inject } from '@angular/core/testing';

import { OrdinationService } from './ordination.service';

describe('OrdinationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdinationService]
    });
  });

  it('should be created', inject([OrdinationService], (service: OrdinationService) => {
    expect(service).toBeTruthy();
  }));
});
