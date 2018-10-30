import { Component, OnInit } from '@angular/core';
import { Workplace } from '../../../../models/workplace';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkplaceService } from '../../../../services/workplace.service';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { isNull } from 'util';

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
        title: 'Nom'
      }
    ]
  };

  securityOnDeletion = '';

  constructor(private workplaceService: WorkplaceService,
              private myModalService: MyModalService,
              private notificationService: NotificationsService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.refreshWorkplaceList();

    this.workplaceForm = this.formBuilder.group(
      {
        name: null,
        details: null,
        seats: null,
        address_line1: null,
        address_line2: '',
        postal_code: null,
        city: null,
        state_province: null,
        country: null,
      }
    );
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
            this.notificationService.success('Supprimé', 'L\'espace de travail a bien été supprimé.');
            this.refreshWorkplaceList();
          },
          err => {
            this.notificationService.error('Erreur', 'Echec de la tentative de suppression.');
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
          this.notificationService.success('Ajouté');
          this.refreshWorkplaceList();
          this.toggleModal('form_workplaces');
        },
        err => {
          if (err.error.non_field_errors) {
            this.workplaceErrors = err.error.non_field_errors;
          }
          if (err.error.name) {
            this.workplaceForm.controls['name'].setErrors({
              apiError: err.error.name
            });
          }
          if (err.error.details) {
            this.workplaceForm.controls['details'].setErrors({
              apiError: err.error.details
            });
          }
          if (err.error.seats) {
            this.workplaceForm.controls['seats'].setErrors({
              apiError: err.error.seats
            });
          }
          if (err.error.address_line1) {
            this.workplaceForm.controls['address_line1'].setErrors({
              apiError: err.error.address_line1
            });
          }
          if (err.error.address_line2) {
            this.workplaceForm.controls['address_line2'].setErrors({
              apiError: err.error.address_line2
            });
          }
          if (err.error.postal_code) {
            this.workplaceForm.controls['postal_code'].setErrors({
              apiError: err.error.postal_code
            });
          }
          if (err.error.city) {
            this.workplaceForm.controls['city'].setErrors({
              apiError: err.error.city
            });
          }
          if (err.error.country) {
            this.workplaceForm.controls['country'].setErrors({
              apiError: err.error.country
            });
          }
          if (err.error.state_province) {
            this.workplaceForm.controls['state_province'].setErrors({
              apiError: err.error.state_province
            });
          }
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
