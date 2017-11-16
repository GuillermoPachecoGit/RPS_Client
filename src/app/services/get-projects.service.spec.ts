import { TestBed, inject } from '@angular/core/testing';

import { GetProjectsService } from './get-projects.service';

describe('GetProjectsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetProjectsService]
    });
  });

  it('should be created', inject([GetProjectsService], (service: GetProjectsService) => {
    expect(service).toBeTruthy();
  }));
});
