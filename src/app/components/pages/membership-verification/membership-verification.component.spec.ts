import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipVerificationComponent } from './membership-verification.component';

describe('MembershipVerificationComponent', () => {
  let component: MembershipVerificationComponent;
  let fixture: ComponentFixture<MembershipVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
