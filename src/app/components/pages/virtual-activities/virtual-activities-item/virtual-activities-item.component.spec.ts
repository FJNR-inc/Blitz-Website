import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualActivitiesItemComponent } from './virtual-activities-item.component';

describe('VirtualActivitiesItemComponent', () => {
  let component: VirtualActivitiesItemComponent;
  let fixture: ComponentFixture<VirtualActivitiesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualActivitiesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualActivitiesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
