import { TestBed, inject } from '@angular/core/testing';

import { SharedDataSessionService } from './shared-data-session.service';

describe('SharedDataSessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedDataSessionService]
    });
  });

  it('should be created', inject([SharedDataSessionService], (service: SharedDataSessionService) => {
    expect(service).toBeTruthy();
  }));
});
