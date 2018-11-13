import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Organization } from '../../../../models/organization';
import { OrganizationService } from '../../../../services/organization.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { DomainService } from '../../../../services/domain.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';

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
    title: 'Nom de domaine',
    noDataText: 'Aucun nom de domaine pour le moment',
    addButton: true,
    removeButton: false,
    columns: [
      {
        name: 'name',
        title: 'Nom de domaine'
      },
      {
        name: 'example',
        title: 'Exemple'
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
    this.toogleModal('form_domain', 'Ajouter un nom de domaine', 'Créer');
  }

  OpenModalEditDomain(item) {
    this.resetForm();
    this.domainForm.controls['name'].setValue(item.name);
    this.domainForm.controls['example'].setValue(item.example);
    this.selectedDomainUrl = item.url;
    this.toogleModal('form_domain', 'Éditer un nom de domaine', 'Éditer');
  }

  submitDomain() {
    if ( this.domainForm.valid ) {
      if (this.selectedDomainUrl) {
        this.domainService.update(this.selectedDomainUrl, this.domainForm.value).subscribe(
          data => {
            this.notificationService.success('shared.notifications.commons.updated.title');
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
            this.notificationService.success('shared.notifications.commons.added.title');
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
          'shared.notifications.delete_domain_name.title',
          'shared.notifications.delete_domain_name.content'
        );
        this.refreshOrganization();
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
}
