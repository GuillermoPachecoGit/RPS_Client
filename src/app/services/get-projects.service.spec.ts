import { TestBed, inject } from '@angular/core/testing';

import { ProjectService } from './get-projects.service';

describe('GetProjectsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectService]
    });
  });

  it('should be created', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));
});
