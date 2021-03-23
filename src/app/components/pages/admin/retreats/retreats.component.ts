import { Component, OnInit } from '@angular/core';
import { Retreat } from '../../../../models/retreat';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import { RetreatService } from '../../../../services/retreat.service';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { Router } from '@angular/router';
import { isNull } from 'util';
import { MyNotificationService } from '../../../../services/my-notification/my-notification.service';
import { FormUtil } from '../../../../utils/form';
import { _ } from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {RetreatType} from '../../../../models/retreatType';
import {RetreatTypeService} from '../../../../services/retreat-type.service';
import {Membership} from '../../../../models/membership';
import {AcademicLevel} from '../../../../models/academicLevel';
import {MembershipService} from '../../../../services/membership.service';

interface Choice {
  value: any;
  label: string;
}

export class RetreatAdapted extends Retreat {
  start_time_readable: string;
}

@Component({
  selector: 'app-retreats',
  templateUrl: './retreats.component.html',
  styleUrls: ['./retreats.component.scss']
})
export class RetreatsComponent implements OnInit {

  listRetreats: Retreat[];
  retreatTypes: RetreatType[];
  listAdaptedRetreats: RetreatAdapted[];

  retreatForm: FormGroup;
  retreatErrors: string[];
  retreatBulkForm: FormGroup;
  selectedRetreatUrl: string;

  settings = {
    title: _('retreats.retreats'),
    noDataText: _('retreats.no_retreat'),
    addButton: true,
    clickable: true,
    previous: false,
    downloadButton: true,
    openTabButton: true,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('retreats.form.name')
      },
      {
        name: 'start_time_readable',
        title: _('retreats.form.date')
      }
    ]
  };

  fields = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('retreats.form.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('retreats.form.name_in_english')
    },
    {
      name: 'price',
      type: 'number',
      label: _('retreats.form.price')
    },
    {
      name: 'type',
      type: 'select',
      label: _('retreat.form.type'),
      choices: []
    },
  ];

  bulk_fields = [
    {
      name: 'bulk_start_time',
      type: 'datetime',
      label: _('retreats.form.bulk_start_time')
    },
    {
      name: 'bulk_end_time',
      type: 'datetime',
      label: _('retreats.form.bulk_end_time')
    },
    {
      name: 'seats',
      type: 'number',
      label: _('retreats.form.seats')
    },
    {
      name: 'price',
      type: 'number',
      label: _('retreats.form.price')
    },
    {
      name: 'min_day_refund',
      type: 'number',
      label: _('retreats.form.min_day_refund')
    },
    {
      name: 'min_day_exchange',
      type: 'number',
      label: _('retreats.form.min_day_exchange')
    },
    {
      name: 'refund_rate',
      type: 'number',
      label: _('retreats.form.refund_rate')
    },
    {
      name: 'videoconference_tool',
      type: 'text',
      label: _('retreat.form.videoconference_tool')
    },
    {
      name: 'videoconference_link',
      type: 'text',
      label: _('retreat.form.videoconference_link')
    },
    {
      name: 'exclusive_memberships',
      type: 'choices',
      label: _('retreat.form.memberships_required'),
      choices: []
    },
    {
      name: 'activity_language',
      type: 'select',
      label: _('retreat.form.activity_language'),
      choices: [
        {
          label: _('retreat.form.activity_language.choices.english'),
          value: 'EN'
        },
        {
          label: _('retreat.form.activity_language.choices.french'),
          value: 'FR'
        },
        {
          label: _('retreat.form.activity_language.choices.bilingual'),
          value: 'B'
        }
      ]
    },
    {
      name: 'animator',
      type: 'text',
      label: _('retreat.form.animator')
    },
    {
      name: 'hidden',
      type: 'checkbox',
      label: _('retreat.form.hidden')
    },
  ];

  filters = [];
  modalCreateMode: 'default' | 'simple' | 'bulk';

  selectedDays = [];
  days = [
    {
      value: 0,
      label: 'L'
    },
    {
      value: 1,
      label: 'M'
    },
    {
      value: 2,
      label: 'M'
    },
    {
      value: 3,
      label: 'J'
    },
    {
      value: 4,
      label: 'V'
    },
    {
      value: 5,
      label: 'S'
    },
    {
      value: 6,
      label: 'D'
    }
  ];

  listMemberships: Membership[];

  constructor(private retreatService: RetreatService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private router: Router,
              private membershipService: MembershipService,
              private retreatTypeService: RetreatTypeService) { }

  ngOnInit() {
    this.refreshRetreatTypeList();
    this.refreshRetreatList();
    this.refreshMembershipList();
  }

  initRetreatForm() {
    const formUtil = new FormUtil();
    this.retreatForm = formUtil.createFormGroup(this.fields);
  }

  initRetreatBulkForm() {
    const formUtil = new FormUtil();
    this.updateFields();
    this.retreatBulkForm = formUtil.createFormGroup(this.bulk_fields);
  }

  changePage(index: number) {
    this.refreshRetreatList(index);
  }

  refreshMembershipList() {
    this.membershipService.list().subscribe(
      levels => {
        this.listMemberships = levels.results.map(l => new AcademicLevel(l));
        this.initRetreatForm();
        this.initRetreatBulkForm();
      }
    );
  }

  refreshRetreatTypeList() {
    this.retreatTypeService.list().subscribe(
      (retreatTypes) => {
        this.retreatTypes = retreatTypes.results.map(
          o => new RetreatType(o)
        );
        const typeChoices = this.fields.find(field => field.name === 'type');
        typeChoices.choices = [];
        for (const type of this.retreatTypes) {
          const choice: Choice = {
            value: type.url,
            label: type.name
          };
          typeChoices.choices.push(choice);
        }
      }
    );
  }

  refreshRetreatList(page = 1, limit = 20) {
    const filters = this.filters;
    this.retreatService.list(filters, limit, limit * (page - 1)).subscribe(
      retreats => {
        this.settings.numberOfPage = Math.ceil(retreats.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(retreats.previous);
        this.settings.next = !isNull(retreats.next);
        this.listRetreats = retreats.results.map(
          retreat => new Retreat(retreat)
        );
        this.listAdaptedRetreats = [];
        for (const retreat of this.listRetreats) {
          this.listAdaptedRetreats.push(this.retreatAdapter(retreat));
        }
      }
    );
  }

  updateFields(membershipsSelected = []) {
    for (const list of [this.bulk_fields]) {
      for (const field of list) {
        if (field.name === 'exclusive_memberships') {
          field['choices'] = [];
          for (const level of this.listMemberships) {
            const choice = {
              label: level.name,
              value: membershipsSelected.indexOf(level.url) > -1
            };
            // @ts-ignore
            field['choices'].push(choice);
          }
        }
      }
    }
  }

  OpenModalCreateRetreat() {
    this.modalCreateMode = 'default';
    this.initRetreatForm();
    this.selectedRetreatUrl = null;
    this.toggleModal(
      'form_retreats',
      _('retreats.create_retreat_modal.title')
    );
  }

  redirectToRetreat(id = null, inNewTab = false) {
    let url = '/admin/retreats/';
    if (id !== null) {
      url += id.toString();
    } else {
      url += 'new';
    }

    if (inNewTab) {
      window.open(url, '_blank');
    } else {
      this.router.navigate([url]);
    }
  }

  toggleModal(name, title: string | string[] = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      return;
    }

    modal.title = title;
    modal.toggle();
  }

  submitRetreat() {
    const value = this.retreatForm.value;
    value['timezone'] = 'America/Montreal';
    this.retreatService.create(value).subscribe(
      () => {
        this.notificationService.success(
          _('retreats.notifications.commons.added.title')
        );
        this.refreshRetreatList();
        this.toggleModal('form_retreats');
      },
      err => {
        if (err.error.non_field_errors) {
          this.retreatErrors = err.error.non_field_errors;
        } else {
          this.retreatErrors =  ['retreats.form.errors.unknown'];
        }
        this.retreatForm = FormUtil.manageFormErrors(this.retreatForm, err);
      }
    );
  }

  submitBulkRetreat() {
    const value = this.retreatBulkForm.value;
    value['timezone'] = 'America/Montreal';

    const formArray = this.retreatBulkForm.get('exclusive_memberships') as FormArray;
    value['exclusive_memberships'] = [];
    let index = 0;
    for (const control of formArray.controls) {
      if (control.value) {
        value['exclusive_memberships'].push(this.listMemberships[index].url);
      }
      index++;
    }

    this.retreatService.createBulk(value).subscribe(
      () => {
        this.notificationService.success(
          _('retreats.notifications.commons.added.title')
        );
        this.refreshRetreatList();
        this.toggleModal('form_retreats');
      },
      err => {
        if (err.error.non_field_errors) {
          this.retreatErrors = err.error.non_field_errors;
        } else {
          this.retreatErrors =  ['retreats.form.errors.unknown'];
        }
        this.retreatForm = FormUtil.manageFormErrors(this.retreatForm, err);
      }
    );
  }

  exportReservations(retreat: Retreat) {
    this.retreatService.exportReservations(retreat.id).subscribe(
      data => {
        window.open(data.file_url);
      }
    );
  }

  retreatAdapter(retreat: Retreat) {
    const retreatAdapted = new RetreatAdapted(retreat);
    retreatAdapted.start_time_readable = retreat.getDateInterval();
    return retreatAdapted;
  }

  updateFilter(name, value) {
    let update = false;
    for (const filter of this.filters) {
      if (filter.name === name) {
        filter.value = value;
        update = true;
      }
    }
    if (!update) {
      const newFilter = {
        name: name,
        value: value
      };
      this.filters.push(newFilter);
    }
    this.refreshRetreatList();
  }

  toogleDay(day) {
    const index = this.selectedDays.indexOf(day);
    if (index > -1) {
      this.selectedDays.splice(index, 1);
    } else {
      this.selectedDays.push(day);
    }
  }
}
