import { TestBed, inject } from '@angular/core/testing';

import { InitTemplateService } from './init-template.service';

describe('InitTemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitTemplateService]
    });
  });

  it('should be created', inject([InitTemplateService], (service: InitTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
