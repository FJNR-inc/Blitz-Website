import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipRegisterComponent } from './membership-register.component';

describe('MembershipRegisterComponent', () => {
  let component: MembershipRegisterComponent;
  let fixture: ComponentFixture<MembershipRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
