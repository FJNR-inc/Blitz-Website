import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Period} from '../../../models/period';
import {isNull} from 'util';
import {PeriodService} from '../../../services/period.service';
import {MyModalService} from '../../../services/my-modal/my-modal.service';
import {Router} from '@angular/router';
import {Workplace} from '../../../models/workplace';
import {WorkplaceService} from '../../../services/workplace.service';
import {MyNotificationService} from '../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../utils/form';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-table-periods',
  templateUrl: './table-periods.component.html',
  styleUrls: ['./table-periods.component.scss']
})
export class TablePeriodsComponent implements OnInit {

  @Input() workplace: Workplace = null;

  listPeriods: Period[];
  listAdaptedPeriods: any[];
  listWorkplaces: Workplace[];

  periodForm: FormGroup;
  periodErrors: string[];
  selectedPeriod: Period;

  settings = {
    title: 'Périodes de réservation',
    noDataText: 'Aucune périodes de réservation pour le moment',
    clickable: true,
    addButton: true,
    editButton: true,
    removeButton: true,
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
        name: 'start_date',
        title: 'shared.form.start_date'
      },
      {
        name: 'end_date',
        title: 'shared.form.end_date'
      },
      {
        name: 'is_active',
        title: 'shared.form.available',
        type: 'boolean'
      }
    ]
  };

  periodInDeletion: any = null;
  securityOnDeletion: false;
  messageOnDeletion = '';

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
      name: 'start_date',
      type: 'datetime',
      label: 'shared.form.start_date'
    },
    {
      name: 'end_date',
      type: 'datetime',
      label: 'shared.form.end_date'
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: 'shared.form.available'
    }
  ];

  constructor(private periodService: PeriodService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private router: Router,
              private workplaceService: WorkplaceService,
              private translate: TranslateService) { }

  ngOnInit() {
    this.translateItems();
    this.refreshPeriodList();
    this.refreshWorkplaceList();

    const formUtil = new FormUtil();
    this.periodForm = formUtil.createFormGroup(this.fields);
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

  refreshWorkplaceList() {
    this.workplaceService.list().subscribe(
      workplaces => {
        this.listWorkplaces = workplaces.results.map(w => new Workplace(w));
      }
    );
  }

  refreshPeriodList(page = 1, limit = 20) {
    let filter = null;
    if (this.workplace) {
      filter = [{'name': 'workplace', 'value': this.workplace.id}];
    }
    console.log(filter);
    this.periodService.list(filter, limit, limit * (page - 1)).subscribe(
      periods => {
        this.settings.numberOfPage = Math.ceil(periods.count / limit);
        this.settings.page = page;
        // todo: remove previous and next page on all pagined page.
        this.settings.previous = !isNull(periods.previous);
        this.settings.next = !isNull(periods.next);
        this.listPeriods = periods.results.map(p => new Period(p));
        this.listAdaptedPeriods = [];
        for (const period of this.listPeriods) {
          this.listAdaptedPeriods.push(this.periodAdapter(period));
        }
      }
    );
  }

  changePage(index: number) {
    this.refreshPeriodList(index);
  }

  OpenModalCreatePeriod() {
    this.periodErrors = [];
    this.periodForm.reset();
    this.periodForm.controls['is_active'].setValue(false);
    this.selectedPeriod = null;
    this.toggleModal('form_periods', 'Ajouter une période', 'Créer');
  }

  OpenModalEditPeriod(item) {
    this.periodErrors = [];
    for (const period of this.listPeriods) {
      if (period.id === item.id) {
        this.periodForm.controls['name_fr'].setValue(period.name_fr);
        this.periodForm.controls['name_en'].setValue(period.name_en);
        this.periodForm.controls['start_date'].setValue(period.start_date);
        this.periodForm.controls['end_date'].setValue(period.end_date);
        this.periodForm.controls['is_active'].setValue(period.is_active);
        this.selectedPeriod = period;
        this.toggleModal('form_periods', 'Éditer une période', 'Éditer');
      }
    }
  }

  submitPeriod() {
    const request = this.periodForm.value;

    if (this.selectedPeriod) {
      request['price'] = this.selectedPeriod.price;

      this.periodService.update(this.selectedPeriod.url, request).subscribe(
        data => {
          this.notificationService.success('shared.notifications.commons.updated.title');
          this.refreshPeriodList();
          this.toggleModal('form_periods');
        },
        err => {
          if (err.error.non_field_errors) {
            this.periodErrors = err.error.non_field_errors;
          } else {
            this.translate.get('shared.form.errors.unknown').subscribe(
              (translatedLabel: string) => {
                this.periodErrors =  [translatedLabel];
              }
            );
          }
          this.periodForm = FormUtil.manageFormErrors(this.periodForm, err);
        }
      );
    } else {
      if ( this.workplace ) {
        request['workplace'] = this.workplace.url;
      }
      request['price'] = 1;
      this.periodService.create(request).subscribe(
        data => {
          this.notificationService.success('shared.notifications.commons.updated.title');
          this.refreshPeriodList();
          this.toggleModal('form_periods');
        },
        err => {
          if (err.error.non_field_errors) {
            this.periodErrors = err.error.non_field_errors;
          } else {
            this.translate.get('shared.form.errors.unknown').subscribe(
              (translatedLabel: string) => {
                this.periodErrors =  [translatedLabel];
              }
            );
          }
          this.periodForm = FormUtil.manageFormErrors(this.periodForm, err);
        }
      );
    }
  }

  removePeriod(item = null, force = false) {
    if (!item && !this.periodInDeletion) {
      console.error('No one timeslot given in argument');
    } else {
      if (item) {
        this.periodInDeletion = item;
      }
      if (!force && this.periodInDeletion.total_reservations > 0) {
        this.toggleModal('validation_deletion', 'Attention!', 'Rembourser & Contacter');
      } else {
        console.log(force);
        console.log(this.periodInDeletion.total_reservations);
        this.periodService.remove(this.periodInDeletion, force, this.messageOnDeletion).subscribe(
          data => {
            this.notificationService.success('shared.notifications.delete_period.title', 'shared.notifications.delete_period.content');
            this.myModalService.get('validation_deletion').close();
            this.refreshPeriodList();
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

  periodAdapter(period) {
    return {
      id: period.id,
      url: period.url,
      name: period.name,
      start_date: period.getStartDay(),
      end_date: period.getEndDay(),
      is_active: period.is_active,
      total_reservations: period.total_reservations
    };
  }

  goToPeriod(event) {
    this.router.navigate(['/admin/periods/' + event.id]);
  }

  isSecurityOnDeletionValid() {
    return this.securityOnDeletion;
  }
}
