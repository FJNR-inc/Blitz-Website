import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetreatInvitationComponent } from './retreat-invitation.component';

describe('RetreatInvitationComponent', () => {
  let component: RetreatInvitationComponent;
  let fixture: ComponentFixture<RetreatInvitationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetreatInvitationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetreatInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
