import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualActivitiesComponent } from './virtual-activities.component';

describe('VirtualActivitiesComponent', () => {
  let component: VirtualActivitiesComponent;
  let fixture: ComponentFixture<VirtualActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
