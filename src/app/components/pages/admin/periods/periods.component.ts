import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { Period } from '../../../../models/period';
import { PeriodService } from '../../../../services/period.service';

@Component({
  selector: 'app-periods',
  templateUrl: './periods.component.html',
  styleUrls: ['./periods.component.scss']
})
export class PeriodsComponent implements OnInit {

  listPeriods: Period[];

  periodForm: FormGroup;
  periodErrors: string[];
  selectedPeriodUrl: string;

  settings = {
    addButton: true,
    editButton: true,
    removeButton: true,
    columns: [
      {
        name: 'name',
        title: 'Nom'
      }
    ]
  };

  constructor(private periodService: PeriodService,
              private myModalService: MyModalService,
              private notificationService: NotificationsService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.refreshPeriodList();

    this.periodForm = this.formBuilder.group(
      {
        name: null
      }
    );
  }

  refreshPeriodList() {
    this.periodService.list().subscribe(
      periods => {
        this.listPeriods = periods.results.map(p => new Period(p));
      }
    );
  }

  OpenModalCreatePeriod() {
    this.periodForm.reset();
    this.selectedPeriodUrl = null;
    this.toogleModal('form_periods', 'Ajouter une periode', 'Creer');
  }

  OpenModalEditPeriod(item) {
    this.periodForm.controls['name'].setValue(item.name);
    this.selectedPeriodUrl = item.url;
    this.toogleModal('form_periods', 'Editer une periode', 'Editer');
  }

  submitPeriod() {
    if ( this.periodForm.valid ) {
      if (this.selectedPeriodUrl) {
        this.periodService.update(this.selectedPeriodUrl, this.periodForm.value).subscribe(
          data => {
            this.notificationService.success('Modifié');
            this.refreshPeriodList();
            this.toogleModal('form_periods');
          },
          err => {
            if (err.error.non_field_errors) {
              this.periodErrors = err.error.non_field_errors;
              console.log(this.periodErrors);
            }
            if (err.error.name) {
              this.periodForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      } else {
        this.periodService.create(this.periodForm.value).subscribe(
          data => {
            this.notificationService.success('Ajouté');
            this.refreshPeriodList();
            this.toogleModal('form_periods');
          },
          err => {
            if (err.error.non_field_errors) {
              this.periodErrors = err.error.non_field_errors;
              console.log(this.periodErrors);
            }
            if (err.error.name) {
              this.periodForm.controls['name'].setErrors({
                apiError: err.error.name
              });
            }
          }
        );
      }
    }
  }

  removePeriod(item) {
    this.periodService.remove(item).subscribe(
      data => {
        this.notificationService.success('Supprimé', 'La période a bien été supprimé.');
        this.refreshPeriodList();
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
