import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {RetreatDateService} from '../../../../services/retreat-date.service';
import {Retreat} from '../../../../models/retreat';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {FormGroup} from '@angular/forms';
import {FormUtil} from '../../../../utils/form';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {TableSetting} from '../../../my-table/my-table.component';
import {RetreatDate} from '../../../../models/retreatDate';

interface Choice {
  value: any;
  label: string;
}

interface Field {
  name: string;
  type: string;
  label: string | string[];
  choices?: Choice[];
}

export class RetreatDateAdapted extends RetreatDate {
  start_time_readable: string;
  end_time_readable: string;
}


@Component({
  selector: 'app-retreat-date',
  templateUrl: './retreat-date.component.html',
  styleUrls: ['./retreat-date.component.scss']
})
export class RetreatDateComponent implements OnInit {

  _retreat: Retreat;
  get retreat() {
    return this._retreat;
  }
  @Input() set retreat(value: Retreat) {
    this._retreat = value;
    this.refreshDates();
  }
  @Output() editedDates: EventEmitter<void> = new EventEmitter<void>();

  listDates: RetreatDateAdapted[];

  settings: TableSetting = {
    title: _('retreat-date.title_table'),
    noDataText: _('retreat-date.no_dates'),
    addButton: true,
    removeButton: true,
    clickable: false,
    previous: false,
    editButton: true,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'start_time_readable',
        title: _('retreat-date.common.start_time')
      },
      {
        name: 'end_time_readable',
        title: _('retreat-date.common.end_time')
      },
    ]
  };

  selectedDate: RetreatDateAdapted;

  dateForm: FormGroup;
  errors: string[];

  dateFields: Field[] = [
    {
      name: 'start_time',
      type: 'datetime',
      label: _('retreat-date.form.start_time')
    },
    {
      name: 'end_time',
      type: 'datetime',
      label: _('retreat-date.form.end_time')
    }
  ];

  constructor(
    private retreatDateService: RetreatDateService,
    private myModalService: MyModalService,
    private notificationService: MyNotificationService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    const formUtil = new FormUtil();
    this.dateForm = formUtil.createFormGroup(this.dateFields);
  }

  askToRefreshDates() {
    this.editedDates.emit();
  }

  refreshDates() {
    this.listDates = [];
    for (const date of this.retreat.dates) {
      this.listDates.push(this.dateAdapter(new RetreatDate(date)));
    }
  }

  addDate() {
    const modal = this.myModalService.get('form_retreat_dates');

    if (!modal) {
      return;
    }

    modal.title = _('retreat-date.form.modal_add_title');
    modal.button2Label = _('retreat-date.form.modal_add_btn');
    this.selectedDate = null;
    this.initForm();
    modal.toggle();
  }

  editDate(date: RetreatDateAdapted) {
    const modal = this.myModalService.get('form_retreat_dates');

    if (!modal) {
      return;
    }

    modal.title = _('retreat-date.form.modal_edit_title');
    modal.button2Label = _('retreat-date.form.modal_edit_btn');
    this.selectedDate = date;
    this.initForm();
    this.dateForm.controls['start_time'].setValue(this.selectedDate.start_time);
    this.dateForm.controls['end_time'].setValue(this.selectedDate.end_time);
    modal.toggle();
  }


  fillForm() {
    if (this.selectedDate) {
      this.dateForm.patchValue(this.selectedDate);
    }
  }

  removeDate(selectedDate) {
    this.retreatDateService.remove(selectedDate).subscribe(
      () => {
        this.askToRefreshDates();
        this.notificationService.success(
          _('retreat-date.notifications.commons.deleted.title')
        );
      },
      err => {
        this.notificationService.success(
          _('retreat-date.notifications.commons.deleted-error.title')
        );
      }
    );
  }

  submitDate() {
    if (this.selectedDate) {

      const data: RetreatDate = this.dateForm.value;

      const start_date = new Date(data.start_time);
      start_date.setSeconds(0);
      data.start_time = start_date.toISOString();

      const end_time = new Date(data.end_time);
      end_time.setSeconds(0);
      data.end_time = end_time.toISOString();

      this.retreatDateService
        .update(this.selectedDate.url, data).subscribe(
        () => {
          this.askToRefreshDates();
          this.myModalService.get('form_retreat_dates').close();
          this.notificationService.success(
            _('retreat-date.notifications.commons.updated.title')
          );
        },
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
          } else {
            this.errors =  ['retreat-date.form.errors.unknown'];
          }
          this.dateForm = FormUtil.manageFormErrors(this.dateForm, err);
        }
      );

    } else {

      const date: RetreatDate = this.dateForm.value;
      date.retreat = this.retreat.url;

      const start_date = new Date(date.start_time);
      start_date.setSeconds(0);
      date.start_time = start_date.toISOString();

      const end_time = new Date(date.end_time);
      end_time.setSeconds(0);
      date.end_time = end_time.toISOString();

      this.retreatDateService
        .create(date).subscribe(
        () => {
          this.askToRefreshDates();
          this.myModalService.get('form_retreat_dates').close();
          this.notificationService.success(
            _('retreat-date.notifications.commons.added.title')
          );
        }  ,
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
          } else {
            this.errors =  ['retreat-date.form.errors.unknown'];
          }
          this.dateForm = FormUtil.manageFormErrors(this.dateForm, err);
        }
      );
    }
  }

  dateAdapter(date: RetreatDate) {
    const dateAdapted = new RetreatDateAdapted(date);
    dateAdapted.start_time_readable = date.getStartTime();
    dateAdapted.end_time_readable = date.getEndTime();
    return dateAdapted;
  }
}
