import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipSubscriptionComponent } from './membership-subscription.component';

describe('MembershipSubscriptionComponent', () => {
  let component: MembershipSubscriptionComponent;
  let fixture: ComponentFixture<MembershipSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
