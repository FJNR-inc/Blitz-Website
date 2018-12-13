import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtHeaderSubComponent } from './nt-header-sub.component';

describe('NtHeaderSubComponent', () => {
  let component: NtHeaderSubComponent;
  let fixture: ComponentFixture<NtHeaderSubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtHeaderSubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtHeaderSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
