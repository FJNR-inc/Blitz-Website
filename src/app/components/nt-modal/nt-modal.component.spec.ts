import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtModalComponent } from './nt-modal.component';

describe('NtModalComponent', () => {
  let component: NtModalComponent;
  let fixture: ComponentFixture<NtModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
