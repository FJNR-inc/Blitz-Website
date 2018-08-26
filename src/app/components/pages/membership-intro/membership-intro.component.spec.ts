import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipIntroComponent } from './membership-intro.component';

describe('MembershipIntroComponent', () => {
  let component: MembershipIntroComponent;
  let fixture: ComponentFixture<MembershipIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
