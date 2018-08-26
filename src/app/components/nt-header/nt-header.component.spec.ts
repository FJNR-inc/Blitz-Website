import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtHeaderComponent } from './nt-header.component';

describe('NtHeaderComponent', () => {
  let component: NtHeaderComponent;
  let fixture: ComponentFixture<NtHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
