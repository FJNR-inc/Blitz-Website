import {Component, forwardRef, OnInit, ViewChild} from '@angular/core';
import {CKEditorContainerComponent} from '../../../shared/ckeditor-container/ckeditor-container.component';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';

@Component({
  selector: 'app-alert-modal-edit',
  templateUrl: './alert-modal-edit.component.html',
  styleUrls: ['./alert-modal-edit.component.scss']
})
export class AlertModalEditComponent implements OnInit {


  @ViewChild(forwardRef(() => CKEditorContainerComponent), {static: false})
  private cKEditorContainerComponent: CKEditorContainerComponent;

  constructor(
    private notificationService: MyNotificationService) { }

  ngOnInit() {
  }

  saveCKEditor() {
    this.cKEditorContainerComponent.saveData();
  }

  dataSaved() {
    this.notificationService.success(
      _('alert-modal-edit.saved')
    );
  }

}
