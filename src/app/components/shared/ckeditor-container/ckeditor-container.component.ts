import {Component,  Input, OnInit, } from '@angular/core';

import * as EditorTV from '../../../../ckeditor5TV/build/ckeditor.js';
import {AuthenticationService} from '../../../services/authentication.service';
import {User} from '../../../models/user';
import {CKEditorPageService} from '../../../services/ckeditor-page.service';

@Component({
  selector: 'app-ckeditor-container',
  templateUrl: './ckeditor-container.component.html',
  styleUrls: ['./ckeditor-container.component.scss']
})
export class CKEditorContainerComponent implements OnInit {

  @Input()
  height: string;

  @Input()
  pageKey: string;

  public Editor = EditorTV;
  public config = {
    autosave: {
      // The minimum amount of time the Autosave plugin is waiting after the last data change.
      waitingTime: 5000,
      save: editor => this.saveData( editor.getData() )
    },
  };

  disableEditor = true;

  ckEditorPage;

  profile: User;

  constructor(private auth: AuthenticationService,
              private ckEditorPageService: CKEditorPageService) {
  }

  ngOnInit() {
    this.profile = this.auth.getProfile();
    this.disableEditor = !(this.profile && this.profile.is_superuser);
    this.ckEditorPageService.get(this.pageKey).subscribe(
      (ckEditorPage) => {
        if (ckEditorPage) {
          this.ckEditorPage = ckEditorPage;
        }
      }
    );
  }

  public saveData( data ) {

    if (!this.disableEditor) {

      this.ckEditorPageService.update(
        this.ckEditorPage.url,
        {data}
      ).subscribe((ckEditorPage) => {
        if (ckEditorPage) {
          this.ckEditorPage = ckEditorPage;
        }
      });
    }
  }


}
