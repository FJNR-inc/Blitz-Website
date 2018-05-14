import { TestBed, inject } from '@angular/core/testing';

import { AcademicFieldService } from './academic-field.service';

describe('AcademicFieldService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AcademicFieldService]
    });
  });

  it('should be created', inject([AcademicFieldService], (service: AcademicFieldService) => {
    expect(service).toBeTruthy();
  }));
});
