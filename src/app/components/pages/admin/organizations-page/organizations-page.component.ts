import { Component, OnInit } from '@angular/core';
import { Organization } from '../../../../models/organization';
import { OrganizationService } from '../../../../services/organization.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { Router } from '@angular/router';
import { isNull } from 'util';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../../utils/form';
import {TranslateService} from '@ngx-translate/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-organizations-page',
  templateUrl: './organizations-page.component.html',
  styleUrls: ['./organizations-page.component.scss']
})
export class OrganizationsPageComponent implements OnInit {

  listOrganizations: Organization[];

  organizationForm: FormGroup;
  organizationErrors: string[];
  selectedOrganizationUrl: string;

  settings = {
    title: _('organizations.title'),
    noDataText: _('organizations.no_organization'),
    clickable: true,
    addButton: true,
    editButton: true,
    removeButton: false,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('shared.form.name')
      }
    ]
  };

  fields = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('shared.form.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('shared.form.name_in_english')
    }
  ];

  constructor(private organizationService: OrganizationService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.refreshOrganizationList();
    const formUtil = new FormUtil();
    this.organizationForm = formUtil.createFormGroup(this.fields);
  }

  changePage(index: number) {
    this.refreshOrganizationList(index);
  }

  refreshOrganizationList(page = 1, limit = 20) {
    this.organizationService.list(limit, limit * (page - 1)).subscribe(
      organizations => {
        this.settings.numberOfPage = Math.ceil(organizations.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(organizations.previous);
        this.settings.next = !isNull(organizations.next);
        this.listOrganizations = organizations.results.map(o => new Organization(o));
      }
    );
  }

  OpenModalCreateOrganization() {
    this.organizationForm.reset();
    this.selectedOrganizationUrl = null;
    this.toogleModal(
      'form_organizations',
      _('organizations.create_organization_modal.title'),
      _('organizations.create_organization_modal.button')
    );
  }

  OpenModalEditOrganization(item) {
    for (const key of Object.keys(this.organizationForm.controls)) {
      this.organizationForm.controls[key].setValue(item[key]);
    }
    this.selectedOrganizationUrl = item.url;
    this.toogleModal(
      'form_organizations',
      _('organizations.edit_organization_modal.title'),
      _('organizations.edit_organization_modal.button')
    );
  }

  submitOrganization() {
    if ( this.organizationForm.valid ) {
      if (this.selectedOrganizationUrl) {
        this.organizationService.update(this.selectedOrganizationUrl, this.organizationForm.value).subscribe(
          data => {
            this.notificationService.success(
              _('shared.notifications.commons.updated.title')
            );
            this.refreshOrganizationList();
            this.toogleModal('form_organizations');
          },
          err => {
            if (err.error.non_field_errors) {
              this.organizationErrors = err.error.non_field_errors;
            }
            this.organizationForm = FormUtil.manageFormErrors(this.organizationForm, err);
          }
        );
      } else {
        this.organizationService.create(this.organizationForm.value).subscribe(
          data => {
            this.notificationService.success(
              _('shared.notifications.commons.added.title')
            );
            this.refreshOrganizationList();
            this.toogleModal('form_organizations');
          },
          err => {
            if (err.error.non_field_errors) {
              this.organizationErrors = err.error.non_field_errors;
            }
            this.organizationForm = FormUtil.manageFormErrors(this.organizationForm, err);
          }
        );
      }
    }
  }

  removeOrganization(item) {
    this.organizationService.remove(item).subscribe(
      data => {
        this.notificationService.success(
          _('shared.notifications.delete_university.title'),
          _('shared.notifications.delete_university.content')
        );
        this.refreshOrganizationList();
      },
      err => {
        this.notificationService.error(
          _('shared.notifications.fail_deletion.title'),
          _('shared.notifications.fail_deletion.content')
        );
      }
    );
  }

  toogleModal(name, title: string | string[] = '', button2: string | string[] = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
    modal.toggle();
  }

  goToOrganization(event) {
    this.router.navigate(['/admin/organization/' + event.id]);
  }
}
