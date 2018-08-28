import { Component, OnInit } from '@angular/core';
import { AcademicField } from '../../../../models/academicField';
import { AcademicLevel } from '../../../../models/academicLevel';
import { AcademicFieldService } from '../../../../services/academic-field.service';
import { AcademicLevelService } from '../../../../services/academic-level.service';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isNull } from 'util';

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
    addButton: true,
    editButton: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: 'Nom'
      }
    ]
  };

  settingsField = {
    title: 'Domaines d\'études',
    addButton: true,
    editButton: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: 'Nom'
      }
    ]
  };

  constructor(private academicFieldService: AcademicFieldService,
              private academicLevelService: AcademicLevelService,
              private myModalService: MyModalService,
              private notificationService: NotificationsService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.refreshFieldList();
    this.refreshLevelList();

    this.fieldForm = this.formBuilder.group(
      {
        name: null
      }
    );

    this.levelForm = this.formBuilder.group(
      {
        name: null
      }
    );
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
    this.fieldForm.controls['name'].setValue(item.name);
    this.selectedFieldUrl = item.url;
    this.toogleModal('form_academic_fields', 'Éditer un domaine d\'étude', 'Éditer');
  }

  submitField() {
    if ( this.fieldForm.valid ) {
      if (this.selectedFieldUrl) {
        this.academicFieldService.update(this.selectedFieldUrl, this.fieldForm.value['name']).subscribe(
          data => {
            this.notificationService.success('Modifié');
            this.refreshFieldList();
            this.toogleModal('form_academic_fields');
          },
          err => {
            if (err.error.non_field_errors) {
              this.fieldErrors = err.error.non_field_errors;
            }
            if (err.error.name) {
              this.fieldForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      } else {
        this.academicFieldService.create(this.fieldForm.value['name']).subscribe(
          data => {
            this.notificationService.success('Ajouté');
            this.refreshFieldList();
            this.toogleModal('form_academic_fields');
          },
          err => {
            if (err.error.non_field_errors) {
              this.fieldErrors = err.error.non_field_errors;
            }
            if (err.error.name) {
              this.fieldForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      }
    }
  }

  removeField(item) {
    this.academicFieldService.remove(item).subscribe(
      data => {
        this.notificationService.success('Supprimé', 'Le domaine d\'étude a bien été supprimé.');
        this.refreshFieldList();
      },
      err => {
        this.notificationService.error('Erreur', 'Echec de la tentative de suppression.');
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
    this.levelForm.controls['name'].setValue(item.name);
    this.selectedLevelUrl = item.url;
    this.toogleModal('form_academic_levels', 'Éditer un niveau d\'étude', 'Éditer');
  }

  submitLevel() {
    if ( this.levelForm.valid ) {
      if (this.selectedLevelUrl) {
        this.academicLevelService.update(this.selectedLevelUrl, this.levelForm.value['name']).subscribe(
          data => {
            this.notificationService.success('Modifié');
            this.refreshLevelList();
            this.toogleModal('form_academic_levels');
          },
          err => {
            if (err.error.non_field_errors) {
              this.levelErrors = err.error.non_field_errors;
            }
            if (err.error.name) {
              this.levelForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      } else {
        this.academicLevelService.create(this.levelForm.value['name']).subscribe(
          data => {
            this.notificationService.success('Ajouté');
            this.refreshLevelList();
            this.toogleModal('form_academic_levels');
          },
          err => {
            if (err.error.non_field_errors) {
              this.levelErrors = err.error.non_field_errors;
            }
            if (err.error.name) {
              this.levelForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      }
    }
  }

  removeLevel(item) {
    this.academicLevelService.remove(item).subscribe(
      data => {
        this.notificationService.success('Supprimé', 'Le niveau d\'étude a bien été supprimé.');
        this.refreshLevelList();
      },
      err => {
        this.notificationService.error('Erreur', 'Echec de la tentative de suppression.');
      }
    );
  }
}
