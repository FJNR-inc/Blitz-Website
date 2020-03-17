import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertModalEditComponent } from './alert-modal-edit.component';

describe('AlertModalEditComponent', () => {
  let component: AlertModalEditComponent;
  let fixture: ComponentFixture<AlertModalEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertModalEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertModalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
