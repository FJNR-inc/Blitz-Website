import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NtWizzardComponent } from './nt-wizzard.component';

describe('NtWizzardComponent', () => {
  let component: NtWizzardComponent;
  let fixture: ComponentFixture<NtWizzardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NtWizzardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NtWizzardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
