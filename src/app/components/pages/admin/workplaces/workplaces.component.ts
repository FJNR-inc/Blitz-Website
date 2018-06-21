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

  settings = {
    removeButton: true,
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
    this.toogleModal('form_workplaces', 'Éditer un espace de travail', 'Éditer');
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
