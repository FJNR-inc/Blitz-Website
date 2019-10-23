import { Component, OnInit } from '@angular/core';
import { AcademicField } from '../../../../models/academicField';
import { AcademicLevel } from '../../../../models/academicLevel';
import { AcademicFieldService } from '../../../../services/academic-field.service';
import { AcademicLevelService } from '../../../../services/academic-level.service';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isNull } from 'util';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../../utils/form';
import {TranslateService} from '@ngx-translate/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-academics-page',
  templateUrl: './academics-page.component.html',
  styleUrls: ['./academics-page.component.scss']
})
export class AcademicsPageComponent implements OnInit {

  listAcademicFields: AcademicField[];
  listAcademicLevels: AcademicLevel[];

  fieldForm: FormGroup;
  fieldErrors: string[];
  selectedFieldUrl: string;

  levelForm: FormGroup;
  levelErrors: string[];
  selectedLevelUrl: string;

  settingsLevel = {
    title: _('academics-page.level_of_study'),
    noDataText: _('academics-page.no_level_of_study'),
    addButton: true,
    editButton: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('academics-page.form.name')
      }
    ]
  };

  settingsField = {
    title: _('academics-page.field_of_study'),
    noDataText: _('academics-page.no_field_of_study'),
    addButton: true,
    editButton: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('academics-page.form.name')
      }
    ]
  };

  academicFieldFields = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('academics-page.form.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('academics-page.form.name_in_english')
    }
  ];

  academicLevelFields = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('academics-page.form.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('academics-page.form.name_in_english')
    }
  ];

  constructor(private academicFieldService: AcademicFieldService,
              private academicLevelService: AcademicLevelService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService) { }

  ngOnInit() {
    this.refreshFieldList();
    this.refreshLevelList();

    const formUtil = new FormUtil();
    this.fieldForm = formUtil.createFormGroup(this.academicFieldFields);
    this.levelForm = formUtil.createFormGroup(this.academicLevelFields);
  }

  changePageLevel(index: number) {
    this.refreshLevelList(index);
  }

  refreshLevelList(page = 1, limit = 20) {
    this.academicLevelService.list(limit, limit * (page - 1)).subscribe(
      levels => {
        this.settingsLevel.numberOfPage = Math.ceil(levels.count / limit);
        this.settingsLevel.page = page;
        this.settingsLevel.previous = !isNull(levels.previous);
        this.settingsLevel.next = !isNull(levels.next);
        this.listAcademicLevels = levels.results.map(l => new AcademicLevel(l));
      }
    );
  }

  changePageField(index: number) {
    this.refreshFieldList(index);
  }

  refreshFieldList(page = 1, limit = 20) {
    this.academicFieldService.list(limit, limit * (page - 1)).subscribe(
      fields => {
        this.settingsField.numberOfPage = Math.ceil(fields.count / limit);
        this.settingsField.page = page;
        this.settingsField.previous = !isNull(fields.previous);
        this.settingsField.next = !isNull(fields.next);
        this.listAcademicFields = fields.results.map(f => new AcademicField(f));
      }
    );
  }

  OpenModalCreateField() {
    this.fieldForm.reset();
    this.selectedFieldUrl = null;
    this.toogleModal(
      'form_academic_fields',
      _('academics-page.create_field_study_modal.title'),
      _('academics-page.create_field_study_modal.button')
    );
  }

  OpenModalEditField(item) {
    for (const field of this.listAcademicFields) {
      if (item.id === field.id) {
        this.fieldForm.controls['name_fr'].setValue(field.name_fr);
        this.fieldForm.controls['name_en'].setValue(field.name_en);
        this.selectedFieldUrl = item.url;
        this.toogleModal(
          'form_academic_fields',
          _('academics-page.edit_field_study_modal.title'),
          _('academics-page.edit_field_study_modal.button')
        );
      }
    }
  }

  submitField() {
    if ( this.fieldForm.valid ) {
      if (this.selectedFieldUrl) {
        this.academicFieldService.update(this.selectedFieldUrl, this.fieldForm.value).subscribe(
          data => {
            this.notificationService.success('academics-page.notifications.commons.updated.title');
            this.refreshFieldList();
            this.toogleModal('form_academic_fields');
          },
          err => {
            if (err.error.non_field_errors) {
              this.fieldErrors = err.error.non_field_errors;
            } else {
              this.fieldErrors =  ['academics-page.form.errors.unknown'];
            }
            this.fieldForm = FormUtil.manageFormErrors(this.fieldForm, err);
          }
        );
      } else {
        this.academicFieldService.create(this.fieldForm.value).subscribe(
          data => {
            this.notificationService.success('academics-page.notifications.commons.added.title');
            this.refreshFieldList();
            this.toogleModal('form_academic_fields');
          },
          err => {
            if (err.error.non_field_errors) {
              this.fieldErrors = err.error.non_field_errors;
            } else {
              this.fieldErrors =  ['academics-page.form.errors.unknown'];
            }
            this.fieldForm = FormUtil.manageFormErrors(this.fieldForm, err);
          }
        );
      }
    }
  }

  removeField(item) {
    this.academicFieldService.remove(item).subscribe(
      data => {
        this.notificationService.success(
          'academics-page.notifications.delete_academic_field.title',
        );
        this.refreshFieldList();
      },
      err => {
        this.notificationService.error(
          'academics-page.notifications.fail_deletion.title',
          'academics-page.notifications.fail_deletion.content');
      }
    );
  }

  toogleModal(name, title: string | string[] = '', button2: string | string[] = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
    modal.toggle();
  }

  OpenModalCreateLevel() {
    this.levelForm.reset();
    this.selectedLevelUrl = null;
    this.toogleModal(
      'form_academic_levels',
      _('academics-page.modal_add_level'),
      _('academics-page.create_level_modal.button')
    );
  }

  OpenModalEditLevel(item) {
    for (const level of this.listAcademicLevels) {
      if (item.id === level.id) {
        this.levelForm.controls['name_fr'].setValue(level.name_fr);
        this.levelForm.controls['name_en'].setValue(level.name_en);
        this.selectedLevelUrl = item.url;
        this.toogleModal(
          'form_academic_levels',
          _('academics-page.modal_edit_level'),
          _('academics-page.edit_level_modal.button')
        );
      }
    }
  }

  submitLevel() {
    if ( this.levelForm.valid ) {
      if (this.selectedLevelUrl) {
        this.academicLevelService.update(this.selectedLevelUrl, this.levelForm.value).subscribe(
          data => {
            this.notificationService.success('academics-page.notifications.commons.updated.title');
            this.refreshLevelList();
            this.toogleModal('form_academic_levels');
          },
          err => {
            if (err.error.non_field_errors) {
              this.levelErrors = err.error.non_field_errors;
            } else {
              this.levelErrors =  ['academics-page.form.errors.unknown'];
            }
            this.levelForm = FormUtil.manageFormErrors(this.levelForm, err);
          }
        );
      } else {
        this.academicLevelService.create(this.levelForm.value).subscribe(
          data => {
            this.notificationService.success('academics-page.notifications.commons.added.title');
            this.refreshLevelList();
            this.toogleModal('form_academic_levels');
          },
          err => {
            if (err.error.non_field_errors) {
              this.levelErrors = err.error.non_field_errors;
            } else {
              this.levelErrors =  ['academics-page.form.errors.unknown'];
            }
            this.levelForm = FormUtil.manageFormErrors(this.levelForm, err);
          }
        );
      }
    }
  }

  removeLevel(item) {
    this.academicLevelService.remove(item).subscribe(
      data => {
        this.notificationService.success(
          'academics-page.notifications.delete_academic_level.title'
        );
        this.refreshLevelList();
      },
      err => {
        this.notificationService.error(
          'academics-page.notifications.fail_deletion.title',
          'academics-page.notifications.fail_deletion.content'
        );
      }
    );
  }
}
