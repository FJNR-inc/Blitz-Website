import { TestBed, inject } from '@angular/core/testing';

import { MyModalService } from './my-modal.service';

describe('MyModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyModalService]
    });
  });

  it('should be created', inject([MyModalService], (service: MyModalService) => {
    expect(service).toBeTruthy();
  }));
});
