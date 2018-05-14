import { TestBed, inject } from '@angular/core/testing';

import { AcademicLevelService } from './academic-level.service';

describe('AcademicLevelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AcademicLevelService]
    });
  });

  it('should be created', inject([AcademicLevelService], (service: AcademicLevelService) => {
    expect(service).toBeTruthy();
  }));
});
