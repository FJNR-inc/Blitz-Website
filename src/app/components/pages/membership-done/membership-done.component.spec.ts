import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipDoneComponent } from './membership-done.component';

describe('MembershipDoneComponent', () => {
  let component: MembershipDoneComponent;
  let fixture: ComponentFixture<MembershipDoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipDoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
