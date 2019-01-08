import { Component, OnInit } from '@angular/core';
import { Retirement } from '../../../../models/retirement';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RetirementService } from '../../../../services/retirement.service';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { Router } from '@angular/router';
import { isNull } from 'util';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {TranslateService} from '@ngx-translate/core';
import {FormUtil} from '../../../../utils/form';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-retirements',
  templateUrl: './retirements.component.html',
  styleUrls: ['./retirements.component.scss']
})
export class RetirementsComponent implements OnInit {

  listRetirements: Retirement[];

  retirementForm: FormGroup;
  retirementErrors: string[];
  selectedRetirementUrl: string;
  retirementInDeletion: any = null;

  settings = {
    title: _('retirements.retirements'),
    noDataText: _('retirements.no_retirement'),
    addButton: true,
    clickable: true,
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

  securityOnDeletion = '';

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
    },
    {
      name: 'details_fr',
      type: 'textarea',
      label: _('shared.form.description_in_french')
    },
    {
      name: 'details_en',
      type: 'textarea',
      label: _('shared.form.description_in_english')
    },
    {
      name: 'seats',
      type: 'number',
      label: _('shared.form.seats')
    },
    {
      name: 'price',
      type: 'number',
      label: _('shared.form.price')
    },
    {
      name: 'start_time',
      type: 'datetime',
      label: _('shared.form.start_time')
    },
    {
      name: 'end_time',
      type: 'datetime',
      label: _('shared.form.end_time')
    },
    {
      name: 'min_day_refund',
      type: 'number',
      label: _('shared.form.min_day_refund')
    },
    {
      name: 'min_day_exchange',
      type: 'number',
      label: _('shared.form.min_day_exchange')
    },
    {
      name: 'refund_rate',
      type: 'number',
      label: _('shared.form.refund_rate')
    },
    {
      name: 'address_line1_fr',
      type: 'text',
      label: _('shared.form.address_line1_in_french')
    },
    {
      name: 'address_line2_fr',
      type: 'text',
      label: _('shared.form.address_line2_in_french')
    },
    {
      name: 'address_line1_en',
      type: 'text',
      label: _('shared.form.address_line1_in_english')
    },
    {
      name: 'address_line2_en',
      type: 'text',
      label: _('shared.form.address_line2_in_english')
    },
    {
      name: 'postal_code',
      type: 'text',
      label: _('shared.form.postal_code')
    },
    {
      name: 'city_fr',
      type: 'text',
      label: _('shared.form.city_in_french')
    },
    {
      name: 'city_en',
      type: 'text',
      label: _('shared.form.city_in_english')
    },
    {
      name: 'state_province_fr',
      type: 'text',
      label: _('shared.form.state_province_in_french')
    },
    {
      name: 'state_province_en',
      type: 'text',
      label: _('shared.form.state_province_in_english')
    },
    {
      name: 'country_fr',
      type: 'text',
      label: _('shared.form.country_in_french')
    },
    {
      name: 'country_en',
      type: 'text',
      label: _('shared.form.country_in_english')
    },
    {
      name: 'is_active',
      type: 'checkbox',
      label: _('shared.form.available')
    }
  ];

  constructor(private retirementService: RetirementService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    this.refreshRetirementList();

    const formUtil = new FormUtil();
    this.retirementForm = formUtil.createFormGroup(this.fields);
  }

  changePage(index: number) {
    this.refreshRetirementList(index);
  }

  refreshRetirementList(page = 1, limit = 20) {
    this.retirementService.list(null, limit, limit * (page - 1)).subscribe(
      retirements => {
        this.settings.numberOfPage = Math.ceil(retirements.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(retirements.previous);
        this.settings.next = !isNull(retirements.next);
        this.listRetirements = retirements.results.map(o => new Retirement(o));
      }
    );
  }

  OpenModalCreateRetirement() {
    this.retirementForm.reset();
    this.selectedRetirementUrl = null;
    this.toggleModal(
      'form_retirements',
      _('retirements.create_retirement_modal.title'),
      _('retirements.create_retirement_modal.button')
    );
  }

  redirectToRetirement(id = null) {
    let url = '/admin/retirements/';
    if (id !== null) {
      url += id.toString();
    } else {
      url += 'new';
    }
    this.router.navigate([url]);
  }

  removeRetirement(item = null, force = false) {
    if (!item && !this.retirementInDeletion) {
      console.error('No one timeslot given in argument');
    } else {
      if (item) {
        this.retirementInDeletion = item;
      }
      if (!force) {
        this.securityOnDeletion = '';
        this.toggleModal(
          'validation_deletion',
          _('retirements.force_delete_retirement_modal.title'),
          _('retirements.force_delete_retirement_modal.button')
        );
      } else {
        this.retirementService.remove(this.retirementInDeletion).subscribe(
          data => {
            this.notificationService.success(
              _('shared.notifications.delete_space.title'),
              _('shared.notifications.delete_space.content')
            );
            this.refreshRetirementList();
          },
          err => {
            this.notificationService.error(
              _('shared.notifications.fail_deletion.title'),
              _('shared.notifications.fail_deletion.content')
            );
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

  submitRetirement() {
    if ( this.retirementForm.valid ) {
      const value = this.retirementForm.value;
      value['timezone'] = 'America/Montreal';
      this.retirementService.create(value).subscribe(
        data => {
          this.notificationService.success(
            _('shared.notifications.commons.added.title')
          );
          this.refreshRetirementList();
          this.toggleModal('form_retirements');
        },
        err => {
          if (err.error.non_field_errors) {
            this.retirementErrors = err.error.non_field_errors;
          } else {
            this.retirementErrors =  ['shared.form.errors.unknown'];
          }
          this.retirementForm = FormUtil.manageFormErrors(this.retirementForm, err);
        }
      );
    }
  }

  isSecurityOnDeletionValid() {
    if (this.retirementInDeletion) {
      return this.retirementInDeletion.name === this.securityOnDeletion;
    } else {
      return false;
    }
  }
}
