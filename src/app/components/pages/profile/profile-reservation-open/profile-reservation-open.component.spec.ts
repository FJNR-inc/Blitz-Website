import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileReservationOpenComponent } from './profile-reservation-open.component';

describe('ProfileReservationOpenComponent', () => {
  let component: ProfileReservationOpenComponent;
  let fixture: ComponentFixture<ProfileReservationOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileReservationOpenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileReservationOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
