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
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {AuthenticationService} from '../../../services/authentication.service';

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
    title: _('table-periods.periods'),
    noDataText: _('table-periods.no_period'),
    clickable: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('table-periods.form.name')
      },
      {
        name: 'start_date',
        title: _('table-periods.form.start_date')
      },
      {
        name: 'end_date',
        title: _('table-periods.form.end_date')
      },
      {
        name: 'is_active',
        title: _('table-periods.form.available'),
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
      label: _('table-periods.form.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('table-periods.form.name_in_english')
    },
    {
      name: 'start_date',
      type: 'datetime',
      label: _('table-periods.form.start_date')
    },
    {
      name: 'end_date',
      type: 'datetime',
      label: _('table-periods.form.end_date')
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: _('table-periods.form.available')
    }
  ];

  constructor(private periodService: PeriodService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private router: Router,
              private workplaceService: WorkplaceService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.refreshPeriodList();
    this.refreshWorkplaceList();

    const formUtil = new FormUtil();
    this.periodForm = formUtil.createFormGroup(this.fields);

    if (this.authenticationService.isAdmin()) {
      this.settings['addButton'] = true;
      this.settings['editButton'] = true;
      this.settings['removeButton'] = true;
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
    this.toggleModal(
      'form_periods',
      _('table-periods.create_period_modal.title'),
      _('table-periods.create_period_modal.button')
    );
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
        this.toggleModal(
          'form_periods',
          _('table-periods.edit_period_modal.title'),
          _('table-periods.edit_period_modal.button')
        );
      }
    }
  }

  submitPeriod() {
    const request = this.periodForm.value;

    if (this.selectedPeriod) {
      request['price'] = this.selectedPeriod.price;

      this.periodService.update(this.selectedPeriod.url, request).subscribe(
        data => {
          this.notificationService.success(
            _('table-periods.notifications.commons.updated.title')
          );
          this.refreshPeriodList();
          this.toggleModal('form_periods');
        },
        err => {
          if (err.error.non_field_errors) {
            this.periodErrors = err.error.non_field_errors;
          } else {
            this.periodErrors =  ['table-periods.form.errors.unknown'];
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
          this.notificationService.success(
            _('table-periods.notifications.commons.updated.title')
          );
          this.refreshPeriodList();
          this.toggleModal('form_periods');
        },
        err => {
          if (err.error.non_field_errors) {
            this.periodErrors = err.error.non_field_errors;
          } else {
            this.periodErrors =  ['table-periods.form.errors.unknown'];
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
        this.toggleModal(
          'validation_deletion',
          _('table-periods.modal_warning_title'),
          _('table-periods.modal_warning_text')
        );
      } else {
        this.periodService.remove(this.periodInDeletion, force, this.messageOnDeletion).subscribe(
          data => {
            this.notificationService.success(
              'table-period.notifications.delete_period.title');
            this.myModalService.get('validation_deletion').close();
            this.refreshPeriodList();
          },
          err => {
            this.notificationService.error(
              'table-periods.notifications.fail_deletion.title',
              'table-periods.notifications.fail_deletion.content');
          }
        );
      }
    }
  }

  toggleModal(name, title: string | string[] = '', button2: string | string[] = '') {
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
