import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipSummaryComponent } from './membership-summary.component';

describe('MembershipSummaryComponent', () => {
  let component: MembershipSummaryComponent;
  let fixture: ComponentFixture<MembershipSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
