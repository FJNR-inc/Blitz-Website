import { Component, OnInit } from '@angular/core';
import { Workplace } from '../../../../models/workplace';
import { FormBuilder, FormGroup } from '@angular/forms';
import { WorkplaceService } from '../../../../services/workplace.service';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

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

  settings = {
    removeButton: true,
    clickable: true,
    columns: [
      {
        name: 'name',
        title: 'Nom'
      }
    ]
  };

  constructor(private workplaceService: WorkplaceService,
              private myModalService: MyModalService,
              private notificationService: NotificationsService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.refreshWorkplaceList();

    this.workplaceForm = this.formBuilder.group(
      {
        name: null
      }
    );
  }

  refreshWorkplaceList() {
    this.workplaceService.list().subscribe(
      workplaces => {
        this.listWorkplaces = workplaces.results.map(o => new Workplace(o));
      }
    );
  }

  OpenModalCreateWorkplace() {
    this.redirectToWorkplace();
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

  OpenModalEditWorkplace(item) {
    this.workplaceForm.controls['name'].setValue(item.name);
    this.selectedWorkplaceUrl = item.url;
    this.toogleModal('form_workplaces', 'Editer un espace de travail', 'Editer');
  }

  removeWorkplace(item) {
    console.log('bad!');
    this.workplaceService.remove(item).subscribe(
      data => {
        this.notificationService.success('Supprimé', 'L\'espace de travail a bien été supprimé.');
        this.refreshWorkplaceList();
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
}
