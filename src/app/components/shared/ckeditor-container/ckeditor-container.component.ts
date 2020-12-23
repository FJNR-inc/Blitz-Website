import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import * as EditorTV from '../../../../ckeditor5TV/build/ckeditor.js';
import {AuthenticationService} from '../../../services/authentication.service';
import {User} from '../../../models/user';
import {CKEditorPageService} from '../../../services/ckeditor-page.service';
import {DomSanitizer} from '@angular/platform-browser';

export interface CKEditorPage {
  url: string;
  id: number;
  key: string;
  data: string;
  updated_at: string;
}

@Component({
  selector: 'app-ckeditor-container',
  templateUrl: './ckeditor-container.component.html',
  styleUrls: ['./ckeditor-container.component.scss']
})
export class CKEditorContainerComponent implements OnInit {

  @Input()
  pageKey: string;

  @Input()
  autoSave = true;

  @Output() updatedAtChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  saved: EventEmitter<any> = new EventEmitter<any>();

  public Editor = EditorTV;
  public configWrite = {
    autosave: {
      // The minimum amount of time the Autosave plugin is waiting after the last data change.
      waitingTime: 5000,
      save: () => this.saveData()
    },
  };
  public configRead = {};
  public config;

  disableEditor = true;

  ckEditorPage: CKEditorPage;

  profile: User;

  constructor(private auth: AuthenticationService,
              private ckEditorPageService: CKEditorPageService,
              private sanitized: DomSanitizer) {
  }

  ngOnInit() {
    this.profile = this.auth.getProfile();
    this.disableEditor = !(this.profile && this.profile.is_superuser);
    this.config = this.disableEditor || !this.autoSave ? this.configRead : this.configWrite;
    this.ckEditorPageService.get(this.pageKey).subscribe(
      (ckEditorPage: CKEditorPage) => {
        if (ckEditorPage) {
          this.ckEditorPage = ckEditorPage;
          this.updatedAtChange.emit(ckEditorPage.updated_at);
        }
      }
    );
  }

  public saveData() {

    const data = this.ckEditorPage.data;

    if (!this.disableEditor) {

      this.ckEditorPageService.update(
        this.ckEditorPage.url,
        {data}
      ).subscribe((ckEditorPage) => {
        if (ckEditorPage) {
          this.ckEditorPage = ckEditorPage;
          this.saved.emit(ckEditorPage);
        }
      });
    }
  }

  cleanContent(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }


}
