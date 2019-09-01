import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetreatUnsubscribeComponent } from './retreat-unsubscribe.component';

describe('RetreatUnsubscribeComponent', () => {
  let component: RetreatUnsubscribeComponent;
  let fixture: ComponentFixture<RetreatUnsubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetreatUnsubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetreatUnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
