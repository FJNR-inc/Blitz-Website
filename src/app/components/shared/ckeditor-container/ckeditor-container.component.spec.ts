import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CKEditorContainerComponent } from './ckeditor-container.component';

describe('CKEditorContainerComponent', () => {
  let component: CKEditorContainerComponent;
  let fixture: ComponentFixture<CKEditorContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CKEditorContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CKEditorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
