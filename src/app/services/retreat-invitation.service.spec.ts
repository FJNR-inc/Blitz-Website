import { TestBed, inject } from '@angular/core/testing';

import { RetreatInvitationService } from './retreat-invitation.service';

describe('RetreatInvitationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetreatInvitationService]
    });
  });

  it('should be created', inject([RetreatInvitationService], (service: RetreatInvitationService) => {
    expect(service).toBeTruthy();
  }));
});
