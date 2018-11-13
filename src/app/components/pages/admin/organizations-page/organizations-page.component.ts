import { Component, OnInit } from '@angular/core';
import { Organization } from '../../../../models/organization';
import { OrganizationService } from '../../../../services/organization.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { Router } from '@angular/router';
import { isNull } from 'util';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';

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
    title: 'Universités',
    noDataText: 'Aucune université pour le moment',
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
        title: 'Nom'
      }
    ]
  };

  constructor(private organizationService: OrganizationService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.refreshOrganizationList();

    this.organizationForm = this.formBuilder.group(
      {
        name: null
      }
    );
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
    this.toogleModal('form_organizations', 'Ajouter une université', 'Créer');
  }

  OpenModalEditOrganization(item) {
    this.organizationForm.controls['name'].setValue(item.name);
    this.selectedOrganizationUrl = item.url;
    this.toogleModal('form_organizations', 'Éditer une université', 'Éditer');
  }

  submitOrganization() {
    if ( this.organizationForm.valid ) {
      if (this.selectedOrganizationUrl) {
        this.organizationService.update(this.selectedOrganizationUrl, this.organizationForm.value['name']).subscribe(
          data => {
            this.notificationService.success('shared.notifications.commons.updated.title');
            this.refreshOrganizationList();
            this.toogleModal('form_organizations');
          },
          err => {
            if (err.error.non_field_errors) {
              this.organizationErrors = err.error.non_field_errors;
            }
            if (err.error.name) {
              this.organizationForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      } else {
        this.organizationService.create(this.organizationForm.value['name']).subscribe(
          data => {
            this.notificationService.success('shared.notifications.commons.added.title');
            this.refreshOrganizationList();
            this.toogleModal('form_organizations');
          },
          err => {
            if (err.error.non_field_errors) {
              this.organizationErrors = err.error.non_field_errors;
            }
            if (err.error.name) {
              this.organizationForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      }
    }
  }

  removeOrganization(item) {
    this.organizationService.remove(item).subscribe(
      data => {
        this.notificationService.success('shared.notifications.delete_university.title', 'shared.notifications.delete_university.content');
        this.refreshOrganizationList();
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

  goToOrganization(event) {
    this.router.navigate(['/admin/organization/' + event.id]);
  }
}
