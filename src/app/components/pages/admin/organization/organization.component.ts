import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Organization } from '../../../../models/organization';
import { OrganizationService } from '../../../../services/organization.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { DomainService } from '../../../../services/domain.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  organizationId: number;
  organization: Organization;

  domainForm: FormGroup;
  domainErrors: string[];
  selectedDomainUrl: string;

  settings = {
    title: _('organization.domain_name'),
    noDataText: _('organization.no_domain_name'),
    addButton: true,
    removeButton: false,
    columns: [
      {
        name: 'name',
        title:  _('organization.domain_name')
      },
      {
        name: 'example',
        title:  _('organization.example')
      }
    ]
  };

  constructor(private activatedRoute: ActivatedRoute,
              private organizationService: OrganizationService,
              private notificationService: MyNotificationService,
              private myModalService: MyModalService,
              private domainService: DomainService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.organizationId = params['id'];
      this.refreshOrganization();
    });

    this.resetForm();
  }

  resetForm() {
    if ( this.organization ) {
      this.domainForm = this.formBuilder.group(
        {
          name: null,
          example: null,
          organization: this.organization.url
        }
      );
    } else {
      this.domainForm = this.formBuilder.group(
        {
          name: null,
          example: null,
          organization: null
        }
      );
    }
  }

  refreshOrganization() {
    this.organizationService.get(this.organizationId).subscribe(
      data => {
        this.organization = new Organization(data);
      }
    );
  }

  OpenModalCreateDomain() {
    this.resetForm();
    this.selectedDomainUrl = null;
    this.toogleModal(
      'form_domain',
      _('organization.create_domain_modal.title'),
      _('organization.create_domain_modal.button')
    );
  }

  OpenModalEditDomain(item) {
    this.resetForm();
    this.domainForm.controls['name'].setValue(item.name);
    this.domainForm.controls['example'].setValue(item.example);
    this.selectedDomainUrl = item.url;
    this.toogleModal(
      'form_domain',
      _('organization.edit_domain_modal.title'),
      _('organization.edit_domain_modal.button')
    );
  }

  submitDomain() {
    if ( this.domainForm.valid ) {
      if (this.selectedDomainUrl) {
        this.domainService.update(this.selectedDomainUrl, this.domainForm.value).subscribe(
          data => {
            this.notificationService.success(
              _('organization.notifications.commons.updated.title')
            );
            this.refreshOrganization();
            this.toogleModal('form_domain');
          },
          err => {
            if (err.error.non_field_errors) {
              this.domainErrors = err.error.non_field_errors;
            }
            if (err.error.name) {
              this.domainForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
            if (err.error.example) {
              this.domainForm.controls['example'].setErrors({
                apiError: err.error.example
              });
            }
          }
        );
      } else {
        this.domainService.create(this.domainForm.value).subscribe(
          data => {
            this.notificationService.success(
              _('organization.notifications.commons.added.title')
            );
            this.refreshOrganization();
            this.toogleModal('form_domain');
          },
          err => {
            if (err.error.non_field_errors) {
              this.domainErrors = err.error.non_field_errors;
            }
            if (err.error.name) {
              this.domainForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
            if (err.error.example) {
              this.domainForm.controls['example'].setErrors({
                apiError: err.error.example
              });
            }
          }
        );
      }
    }
  }

  removeDomain(item) {
    this.domainService.remove(item).subscribe(
      data => {
        this.notificationService.success(
          _('organization.notifications.delete_domain_name.title'),
          _('organization.notifications.delete_domain_name.content')
        );
        this.refreshOrganization();
      },
      err => {
        this.notificationService.error(
          _('organization.notifications.fail_deletion.title'),
          _('organization.notifications.fail_deletion.content')
        );
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
}
