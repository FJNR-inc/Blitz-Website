import { TestBed } from '@angular/core/testing';

import { CKEditorPageService } from './ckeditor-page.service';

describe('CKEditorPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CKEditorPageService = TestBed.get(CKEditorPageService);
    expect(service).toBeTruthy();
  });
});
