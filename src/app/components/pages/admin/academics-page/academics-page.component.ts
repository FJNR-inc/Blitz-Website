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
    title: 'Niveaux d\'études',
    noDataText: 'Aucune niveau d\'étude pour le moment',
    addButton: true,
    editButton: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: 'shared.form.name'
      }
    ]
  };

  settingsField = {
    title: 'Domaines d\'études',
    noDataText: 'Aucun domaine d\'étude pour le moment',
    addButton: true,
    editButton: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: 'shared.form.name'
      }
    ]
  };

  academicFieldFields = [
    {
      name: 'name_fr',
      type: 'text',
      label: 'shared.form.name_in_french'
    },
    {
      name: 'name_en',
      type: 'text',
      label: 'shared.form.name_in_english'
    }
  ];

  academicLevelFields = [
    {
      name: 'name_fr',
      type: 'text',
      label: 'shared.form.name_in_french'
    },
    {
      name: 'name_en',
      type: 'text',
      label: 'shared.form.name_in_english'
    }
  ];

  constructor(private academicFieldService: AcademicFieldService,
              private academicLevelService: AcademicLevelService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private translate: TranslateService) { }

  ngOnInit() {
    this.translateItems();
    this.refreshFieldList();
    this.refreshLevelList();

    const formUtil = new FormUtil();
    this.fieldForm = formUtil.createFormGroup(this.academicFieldFields);
    this.levelForm = formUtil.createFormGroup(this.academicLevelFields);
  }

  translateItems() {
    for (const field of this.academicLevelFields) {
      this.translate.get(field.label).subscribe(
        (translatedLabel: string) => {
          field.label = translatedLabel;
        }
      );
    }

    for (const field of this.academicFieldFields) {
      this.translate.get(field.label).subscribe(
        (translatedLabel: string) => {
          field.label = translatedLabel;
        }
      );
    }

    for (const column of this.settingsField.columns) {
      this.translate.get(column.title).subscribe(
        (translatedLabel: string) => {
          column.title = translatedLabel;
        }
      );
    }

    for (const column of this.settingsLevel.columns) {
      this.translate.get(column.title).subscribe(
        (translatedLabel: string) => {
          column.title = translatedLabel;
        }
      );
    }
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
    this.toogleModal('form_academic_fields', 'Ajouter un domaine d\'étude', 'Créer');
  }

  OpenModalEditField(item) {
    for (const field of this.listAcademicFields) {
      if (item.id === field.id) {
        this.fieldForm.controls['name_fr'].setValue(field.name_fr);
        this.fieldForm.controls['name_en'].setValue(field.name_en);
        this.selectedFieldUrl = item.url;
        this.toogleModal('form_academic_fields', 'Éditer un domaine d\'étude', 'Éditer');
      }
    }
  }

  submitField() {
    if ( this.fieldForm.valid ) {
      if (this.selectedFieldUrl) {
        this.academicFieldService.update(this.selectedFieldUrl, this.fieldForm.value).subscribe(
          data => {
            this.notificationService.success('shared.notifications.commons.updated.title');
            this.refreshFieldList();
            this.toogleModal('form_academic_fields');
          },
          err => {
            if (err.error.non_field_errors) {
              this.fieldErrors = err.error.non_field_errors;
            } else {
              this.translate.get('shared.form.errors.unknown').subscribe(
                (translatedLabel: string) => {
                  this.fieldErrors =  [translatedLabel];
                }
              );
            }
            this.fieldForm = FormUtil.manageFormErrors(this.fieldForm, err);
          }
        );
      } else {
        this.academicFieldService.create(this.fieldForm.value).subscribe(
          data => {
            this.notificationService.success('shared.notifications.commons.added.title');
            this.refreshFieldList();
            this.toogleModal('form_academic_fields');
          },
          err => {
            if (err.error.non_field_errors) {
              this.fieldErrors = err.error.non_field_errors;
            } else {
              this.translate.get('shared.form.errors.unknown').subscribe(
                (translatedLabel: string) => {
                  this.fieldErrors =  [translatedLabel];
                }
              );
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
          'shared.notifications.delete_academic_field.title',
          'shared.notifications.delete_academic_field.content'
        );
        this.refreshFieldList();
      },
      err => {
        this.notificationService.error('shared.notifications.fail_deletion.title', 'shared.notifications.fail_deletion.content');
      }
    );
  }

  toogleModal(name, title = '', button2 = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
    modal.toggle();
  }

  OpenModalCreateLevel() {
    this.levelForm.reset();
    this.selectedLevelUrl = null;
    this.toogleModal('form_academic_levels', 'Ajouter un niveau d\'étude', 'Créer');
  }

  OpenModalEditLevel(item) {
    for (const level of this.listAcademicLevels) {
      if (item.id === level.id) {
        this.levelForm.controls['name_fr'].setValue(level.name_fr);
        this.levelForm.controls['name_en'].setValue(level.name_en);
        this.selectedLevelUrl = item.url;
        this.toogleModal('form_academic_levels', 'Éditer un niveau d\'étude', 'Éditer');
      }
    }
  }

  submitLevel() {
    if ( this.levelForm.valid ) {
      if (this.selectedLevelUrl) {
        this.academicLevelService.update(this.selectedLevelUrl, this.levelForm.value).subscribe(
          data => {
            this.notificationService.success('shared.notifications.commons.updated.title');
            this.refreshLevelList();
            this.toogleModal('form_academic_levels');
          },
          err => {
            if (err.error.non_field_errors) {
              this.levelErrors = err.error.non_field_errors;
            } else {
              this.translate.get('shared.form.errors.unknown').subscribe(
                (translatedLabel: string) => {
                  this.levelErrors =  [translatedLabel];
                }
              );
            }
            this.levelForm = FormUtil.manageFormErrors(this.levelForm, err);
          }
        );
      } else {
        this.academicLevelService.create(this.levelForm.value).subscribe(
          data => {
            this.notificationService.success('shared.notifications.commons.added.title');
            this.refreshLevelList();
            this.toogleModal('form_academic_levels');
          },
          err => {
            if (err.error.non_field_errors) {
              this.levelErrors = err.error.non_field_errors;
            } else {
              this.translate.get('shared.form.errors.unknown').subscribe(
                (translatedLabel: string) => {
                  this.levelErrors =  [translatedLabel];
                }
              );
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
          'shared.notifications.delete_academic_level.title',
          'shared.notifications.delete_academic_level.content'
        );
        this.refreshLevelList();
      },
      err => {
        this.notificationService.error('shared.notifications.fail_deletion.title', 'shared.notifications.fail_deletion.content');
      }
    );
  }
}
