import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileActivateComponent } from './profile-activate.component';

describe('ProfileActivateComponent', () => {
  let component: ProfileActivateComponent;
  let fixture: ComponentFixture<ProfileActivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileActivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
