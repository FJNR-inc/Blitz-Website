import { Component, OnInit } from '@angular/core';
import { Membership } from '../../../../models/membership';
import { MembershipService } from '../../../../services/membership.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { isNull } from 'util';
import { AcademicLevel } from '../../../../models/academicLevel';
import { AcademicLevelService } from '../../../../services/academic-level.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../../utils/form';
import {TranslateService} from '@ngx-translate/core';
import {InternationalizationService} from '../../../../services/internationalization.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-memberships',
  templateUrl: './memberships.component.html',
  styleUrls: ['./memberships.component.scss']
})
export class MembershipsComponent implements OnInit {

  listMemberships: Membership[];
  listAcademicLevels: AcademicLevel[] = [];
  listAdaptedMemberships: any[];
  listAcademicLevelsSelected: string[];

  membershipForm: FormGroup;
  membershipErrors: string[];
  selectedMembershipUrl: string;

  settings = {
    title: 'Memberships',
    noDataText: 'Aucun membership pour le moment',
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
      },
      {
        name: 'price',
        title: 'shared.form.price'
      },
      {
        name: 'available',
        title: 'shared.form.available',
        type: 'boolean'
      }
    ]
  };

  fields = [
    {
      name: 'name_fr',
      type: 'text',
      label: 'shared.form.name_in_french'
    },
    {
      name: 'name_en',
      type: 'text',
      label: 'shared.form.name_in_english'
    },
    {
      name: 'price',
      type: 'number',
      label: 'shared.form.price'
    },
    {
      name: 'academic_levels',
      type: 'choices',
      label: 'shared.form.academic_level_required',
      choices: []
    },
    {
      name: 'warning',
      type: 'alert',
      label: 'memberships.form.alert_academic_levels'
    },
    {
      name: 'available',
      type: 'checkbox',
      label: 'shared.form.available'
    },
  ];

  constructor(private membershipService: MembershipService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private acdemicLevelService: AcademicLevelService,
              private translate: TranslateService,
              private internationalizationService: InternationalizationService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.translateItems();
    this.refreshMembershipList();
    this.refreshAcademicLevelList();
  }

  translateItems() {
    for (const field of this.fields) {
      this.translate.get(field.label).subscribe(
        (translatedLabel: string) => {
          field.label = translatedLabel;
        }
      );
    }

    for (const column of this.settings.columns) {
      this.translate.get(column.title).subscribe(
        (translatedLabel: string) => {
          column.title = translatedLabel;
        }
      );
    }
  }

  initForm(academicLevelsSelected = []) {
    const formUtil = new FormUtil();
    this.updateFields(academicLevelsSelected);
    this.membershipForm = formUtil.createFormGroup(this.fields);
  }

  updateFields(academicLevelsSelected = []) {
    for (const field of this.fields) {
      if (field.name === 'academic_levels') {
        field['choices'] = [];
        for (const level of this.listAcademicLevels) {
          const choice = {
            label: level.name,
            value: academicLevelsSelected.indexOf(level.url) > -1
          };
          field['choices'].push(choice);
        }
      }
    }
  }

  changePage(index: number) {
    this.refreshMembershipList(index);
  }

  refreshMembershipList(page = 1, limit = 20) {
    this.membershipService.list(null, limit, limit * (page - 1)).subscribe(
      memberships => {
        this.settings.numberOfPage = Math.ceil(memberships.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(memberships.previous);
        this.settings.next = !isNull(memberships.next);
        this.listMemberships = memberships.results.map(o => new Membership(o));
        this.listAdaptedMemberships = [];
        for (const membership of this.listMemberships) {
          this.listAdaptedMemberships.push(this.membershipAdapter(membership));
        }
      }
    );
  }

  refreshAcademicLevelList() {
    this.acdemicLevelService.list().subscribe(
      levels => {
        this.listAcademicLevels = levels.results.map(l => new AcademicLevel(l));
        this.initForm([]);
      }
    );
  }

  OpenModalCreateMembership() {
    this.initForm([]);
    this.membershipForm.reset();
    this.membershipForm.controls['available'].setValue(false);

    this.selectedMembershipUrl = null;
    this.toogleModal('form_memberships', 'Ajouter un type de membership', 'Créer');
  }

  OpenModalEditMembership(item) {
    for (const membership of this.listMemberships) {
      if (membership.id === item.id) {
        this.initForm(membership.academic_levels);
        this.membershipForm.controls['name_fr'].setValue(membership.name_fr);
        this.membershipForm.controls['name_en'].setValue(membership.name_en);
        this.membershipForm.controls['price'].setValue(membership.price);
        this.membershipForm.controls['available'].setValue(membership.available);

        this.selectedMembershipUrl = item.url;
        this.toogleModal('form_memberships', 'Éditer un type de membership', 'Éditer');
      }
    }
  }

  submitMembership() {
    if ( this.membershipForm.valid ) {
      const membership = this.membershipForm.value;
      const formArray = this.membershipForm.get('academic_levels') as FormArray;
      membership['academic_levels'] = [];
      let index = 0;
      for (const control of formArray.controls) {
        if (control.value) {
          membership['academic_levels'].push(this.listAcademicLevels[index].url);
        }
        index++;
      }

      if (this.selectedMembershipUrl) {
        this.membershipService.update(this.selectedMembershipUrl, membership).subscribe(
          data => {
            this.notificationService.success('shared.notifications.commons.updated.title');
            this.refreshMembershipList();
            this.toogleModal('form_memberships');
          },
          err => {
            if (err.error.non_field_errors) {
              this.membershipErrors = err.error.non_field_errors;
            } else {
              this.translate.get('shared.form.errors.unknown').subscribe(
                (translatedLabel: string) => {
                  this.membershipErrors =  [translatedLabel];
                }
              );
            }
            this.membershipForm = FormUtil.manageFormErrors(this.membershipForm, err);
          }
        );
      } else {
        this.membershipService.create(membership).subscribe(
          data => {
            this.notificationService.success('shared.notifications.commons.added.title');
            this.refreshMembershipList();
            this.toogleModal('form_memberships');
          },
          err => {
            if (err.error.non_field_errors) {
              this.membershipErrors = err.error.non_field_errors;
            } else {
              this.translate.get('shared.form.errors.unknown').subscribe(
                (translatedLabel: string) => {
                  this.membershipErrors =  [translatedLabel];
                }
              );
            }
            this.membershipForm = FormUtil.manageFormErrors(this.membershipForm, err);
          }
        );
      }
    }
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

  membershipAdapter(membership) {
    return {
      id: membership.id,
      url: membership.url,
      name: membership.name,
      price: membership.price,
      available: membership.available,
    };
  }
}
