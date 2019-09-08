import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsProductsComponent } from './options-products.component';

describe('OptionsProductsComponent', () => {
  let component: OptionsProductsComponent;
  let fixture: ComponentFixture<OptionsProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
