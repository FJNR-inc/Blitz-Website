import { Component, OnInit } from '@angular/core';
import { Retreat } from '../../../../models/retreat';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RetreatService } from '../../../../services/retreat.service';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { Router } from '@angular/router';
import { isNull } from 'util';
import { MyNotificationService } from '../../../../services/my-notification/my-notification.service';
import { FormUtil } from '../../../../utils/form';
import { _ } from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {RetreatType} from '../../../../models/retreatType';
import {RetreatTypeService} from '../../../../services/retreat-type.service';

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
  selectedRetreatUrl: string;

  settings = {
    title: _('retreats.retreats'),
    noDataText: _('retreats.no_retreat'),
    addButton: true,
    clickable: true,
    previous: false,
    downloadButton: true,
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

  constructor(private retreatService: RetreatService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private router: Router,
              private retreatTypeService: RetreatTypeService) { }

  ngOnInit() {
    this.refreshRetreatTypeList();
    this.refreshRetreatList();
    this.initRetreatForm();
  }

  initRetreatForm() {
    const formUtil = new FormUtil();
    this.retreatForm = formUtil.createFormGroup(this.fields);
  }

  changePage(index: number) {
    this.refreshRetreatList(index);
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
    const filters = [];
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

  OpenModalCreateRetreat() {
    this.initRetreatForm();
    this.selectedRetreatUrl = null;
    this.toggleModal(
      'form_retreats',
      _('retreats.create_retreat_modal.title'),
      _('retreats.create_retreat_modal.button')
    );
  }

  redirectToRetreat(id = null) {
    let url = '/admin/retreats/';
    if (id !== null) {
      url += id.toString();
    } else {
      url += 'new';
    }
    this.router.navigate([url]);
  }

  toggleModal(name, title: string | string[] = '', button2: string | string[] = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
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
}
