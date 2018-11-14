import { Component, OnInit } from '@angular/core';
import { Workplace } from '../../../../models/workplace';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkplaceService } from '../../../../services/workplace.service';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { Router } from '@angular/router';
import { isNull } from 'util';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {TranslateService} from '@ngx-translate/core';
import {FormUtil} from '../../../../utils/form';

@Component({
  selector: 'app-workplaces',
  templateUrl: './workplaces.component.html',
  styleUrls: ['./workplaces.component.scss']
})
export class WorkplacesComponent implements OnInit {

  listWorkplaces: Workplace[];

  workplaceForm: FormGroup;
  workplaceErrors: string[];
  selectedWorkplaceUrl: string;
  workplaceInDeletion: any = null;

  settings = {
    title: 'Espaces de travail',
    noDataText: 'Aucun espace de travail pour le moment',
    addButton: true,
    clickable: true,
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

  securityOnDeletion = '';

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
      name: 'details_fr',
      type: 'textarea',
      label: 'shared.form.description_in_french'
    },
    {
      name: 'details_en',
      type: 'textarea',
      label: 'shared.form.description_in_english'
    },
    {
      name: 'seats',
      type: 'number',
      label: 'shared.form.seats'
    },
    {
      name: 'address_line1_fr',
      type: 'text',
      label: 'shared.form.address_line1_in_french'
    },
    {
      name: 'address_line2_fr',
      type: 'text',
      label: 'shared.form.address_line2_in_french'
    },
    {
      name: 'address_line1_en',
      type: 'text',
      label: 'shared.form.address_line1_in_english'
    },
    {
      name: 'address_line2_en',
      type: 'text',
      label: 'shared.form.address_line2_in_english'
    },
    {
      name: 'postal_code',
      type: 'text',
      label: 'shared.form.postal_code'
    },
    {
      name: 'city_fr',
      type: 'text',
      label: 'shared.form.city_in_french'
    },
    {
      name: 'city_en',
      type: 'text',
      label: 'shared.form.city_in_english'
    },
    {
      name: 'state_province_fr',
      type: 'text',
      label: 'shared.form.state_province_in_french'
    },
    {
      name: 'state_province_en',
      type: 'text',
      label: 'shared.form.state_province_in_english'
    },
    {
      name: 'country_fr',
      type: 'text',
      label: 'shared.form.country_in_french'
    },
    {
      name: 'country_en',
      type: 'text',
      label: 'shared.form.country_in_english'
    }
  ];

  constructor(private workplaceService: WorkplaceService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private router: Router,
              private translate: TranslateService) { }

  ngOnInit() {
    this.translateItems();
    this.refreshWorkplaceList();

    const formUtil = new FormUtil();
    this.workplaceForm = formUtil.createFormGroup(this.fields);
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


  changePage(index: number) {
    this.refreshWorkplaceList(index);
  }

  refreshWorkplaceList(page = 1, limit = 20) {
    this.workplaceService.list(limit, limit * (page - 1)).subscribe(
      workplaces => {
        this.settings.numberOfPage = Math.ceil(workplaces.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(workplaces.previous);
        this.settings.next = !isNull(workplaces.next);
        this.listWorkplaces = workplaces.results.map(o => new Workplace(o));
      }
    );
  }

  OpenModalCreateWorkplace() {
    this.workplaceForm.reset();
    this.selectedWorkplaceUrl = null;
    this.toggleModal('form_workplaces', 'Créer un espace de travail', 'Créer l\'espace');
  }

  redirectToWorkplace(id = null) {
    let url = '/admin/workplaces/';
    if (id !== null) {
      url += id.toString();
    } else {
      url += 'new';
    }
    this.router.navigate([url]);
  }

  removeWorkplace(item = null, force = false) {
    if (!item && !this.workplaceInDeletion) {
      console.error('No one timeslot given in argument');
    } else {
      if (item) {
        this.workplaceInDeletion = item;
      }
      if (!force) {
        this.securityOnDeletion = '';
        this.toggleModal('validation_deletion', 'Attention!', 'Supprimer l\'espace');
      } else {
        this.workplaceService.remove(this.workplaceInDeletion).subscribe(
          data => {
            this.notificationService.success('shared.notifications.delete_space.title', 'shared.notifications.delete_space.content');
            this.refreshWorkplaceList();
          },
          err => {
            this.notificationService.error('shared.notifications.fail_deletion.title', 'shared.notifications.fail_deletion.content');
          }
        );
      }
    }
  }

  toggleModal(name, title = '', button2 = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
    modal.toggle();
  }

  submitWorkplace() {
    if ( this.workplaceForm.valid ) {
      const value = this.workplaceForm.value;
      value['timezone'] = 'America/Montreal';
      this.workplaceService.create(value).subscribe(
        data => {
          this.notificationService.success('shared.notifications.commons.added.title');
          this.refreshWorkplaceList();
          this.toggleModal('form_workplaces');
        },
        err => {
          if (err.error.non_field_errors) {
            this.workplaceErrors = err.error.non_field_errors;
          } else {
            this.translate.get('shared.form.errors.unknown').subscribe(
              (translatedLabel: string) => {
                this.workplaceErrors =  [translatedLabel];
              }
            );
          }
          this.workplaceForm = FormUtil.manageFormErrors(this.workplaceForm, err);
        }
      );
    }
  }

  isSecurityOnDeletionValid() {
    if (this.workplaceInDeletion) {
      return this.workplaceInDeletion.name === this.securityOnDeletion;
    } else {
      return false;
    }
  }
}
