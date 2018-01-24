import { TestBed, inject } from '@angular/core/testing';

import { SharedDatasetService } from './shared-dataset.service';

describe('SharedDatasetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedDatasetService]
    });
  });

  it('should be created', inject([SharedDatasetService], (service: SharedDatasetService) => {
    expect(service).toBeTruthy();
  }));
});
