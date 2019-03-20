import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { Period } from '../../../../models/period';
import { PeriodService } from '../../../../services/period.service';
import { TimeSlot } from '../../../../models/timeSlot';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isNull } from 'util';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {AuthenticationService} from '../../../../services/authentication.service';
import {DateUtil} from '../../../../utils/date';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss']
})
export class PeriodComponent implements OnInit {

  alertMessage = _('period.edit_timeslot_modal.alert_security');

  period: Period;
  listTimeslots: TimeSlot[];
  listAdaptedTimeslots: any[];

  timeslotForm: FormGroup;
  timeslotErrors: string[];
  selectedTimeslot: any = null;

  settings = {
    title: _('period.list_of_redaction_bloc'),
    noDataText: _('period.no_bloc'),
    clickable: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'start_time',
        title: _('period.labels.begin_date')
      },
      {
        name: 'end_time',
        title: _('period.labels.end_date')
      },
      {
        name: 'display_reservations',
        title: _('period.labels.number_of_reservations')
      }
    ]
  };

  timeslotInDeletion: any = null;
  securityOnDeletion: false;
  messageOnDeletion = '';

  limitChoices = [10, 20, 100, 1000];
  limit = 20;
  page = 1;

  displayOnlyFutureTimeslot = true;

  createBatch = false;
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

  constructor(private periodService: PeriodService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private timeslotService: TimeSlotService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.periodService.get(params['id']).subscribe(
        period => {
          this.period = new Period(period);
          this.refreshTimeslotList();
        }
      );
    });
    this.resetForm();

    if (this.authenticationService.isAdmin()) {
      this.settings['addButton'] = true;
      this.settings['editButton'] = true;
      this.settings['removeButton'] = true;
    }
  }

  resetForm(edit = false) {
    if (edit) {
      this.timeslotForm = this.formBuilder.group(
        {
          start_time: null,
          end_time: null,
          period: null,
          price: 1,
          force_update: false,
          custom_message: null
        }
      );
    } else {
      this.timeslotForm = this.formBuilder.group(
        {
          start_time: null,
          end_time: null,
          period: null,
          price: 1,
        }
      );
    }
  }

  refreshTimeslotList(onlyFuture = this.displayOnlyFutureTimeslot, page = this.page, limit = this.limit) {
    this.resetTimeslotData();
    const filters: {name: string, value: any}[] = [
      {
        'name': 'period',
        'value': this.period.id
      }
    ];

    if (onlyFuture) {
      filters.push({
        'name': 'end_time__gte',
        'value': new Date().toISOString(),
      });
    }

    this.timeslotService.list(filters, limit, limit * (page - 1), 'start_time').subscribe(
      timeslots => {
        this.settings.numberOfPage = Math.ceil(timeslots.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(timeslots.previous);
        this.settings.next = !isNull(timeslots.next);

        this.listTimeslots = timeslots.results.map(t => new TimeSlot(t));
        this.listAdaptedTimeslots = [];
        for (const timeslot of this.listTimeslots) {
          this.listAdaptedTimeslots.push(this.timeslotAdapter(timeslot));
        }
      }
    );
  }

  OpenModalCreateTimeslot() {
    this.resetForm();
    this.timeslotForm.controls['period'].setValue(this.period.url);
    this.selectedTimeslot = null;
    this.toggleModal(
      'form_timeslots',
      _('period.createTimeslotModal.title'),
      _('period.createTimeslotModal.button')
    );
  }

  OpenModalEditTimeslot(item) {
    this.resetForm(true);
    for (const timeslot of this.listTimeslots) {
      if (timeslot.id === item.id) {
        this.timeslotForm.controls['start_time'].setValue(timeslot.start_time);
        this.timeslotForm.controls['end_time'].setValue(timeslot.end_time);
        this.timeslotForm.controls['period'].setValue(this.period.url);
      }
    }
    this.selectedTimeslot = item;
    this.toggleModal(
      'form_timeslots',
      _('period.editTimeslotModal.title'),
      _('period.editTimeslotModal.button')
    );
  }

  submitTimeslot() {
    if ( this.timeslotForm.valid ) {
      const value = this.timeslotForm.value;
      console.log(value);
      if (isNull(value.custom_message)) {
        delete value['custom_message'];
      }
      if (this.createBatch) {
        const days = [];
        for (const day of this.selectedDays) {
          days.push(day.value);
        }
        value['weekdays'] = days;

        const start_time = value['start_time'];
        const end_time = value['end_time'];

        value['start_time'] = DateUtil.formatTime(start_time);
        value['end_time'] = DateUtil.formatTime(end_time);
        value['start_date'] = DateUtil.formatDate(start_time);
        value['end_date'] = DateUtil.formatDate(end_time);
      }
      if (this.selectedTimeslot) {
        if (this.selectedTimeslot.number_of_reservations > 0 && value.force_update === false) {
          this.timeslotForm.controls['force_update'].setErrors({
            apiError: [_('period.warning_force_submit_timeslot')]
          });
        } else {
          this.timeslotService.update(this.selectedTimeslot.url, value).subscribe(
            data => {
              this.notificationService.success(
                _('shared.notifications.commons.updated.title')
              );
              this.refreshTimeslotList();
              this.toggleModal('form_timeslots');
            },
            err => {
              if (err.error.non_field_errors) {
                this.timeslotErrors = err.error.non_field_errors;
              }
              if (err.error.start_time) {
                this.timeslotForm.controls['start_time'].setErrors({
                  apiError: err.error.start_time
                });
              }
              if (err.error.end_time) {
                this.timeslotForm.controls['end_time'].setErrors({
                  apiError: err.error.end_time
                });
              }
            }
          );
        }
      } else {
        if (this.createBatch) {
          this.timeslotService.createBatch(value).subscribe(
            data => {
              this.handleSuccessCreation();
            },
            err => {
              if (err.error.non_field_errors) {
                this.timeslotErrors = err.error.non_field_errors;
              }
              if (err.error.start_time) {
                this.timeslotForm.controls['start_time'].setErrors({
                  apiError: err.error.start_time
                });
              }
              if (err.error.end_time) {
                this.timeslotForm.controls['end_time'].setErrors({
                  apiError: err.error.end_time
                });
              }
            }
          );
        } else {
          this.timeslotService.create(value).subscribe(
            data => {
              this.handleSuccessCreation();
            },
            err => {
              if (err.error.non_field_errors) {
                this.timeslotErrors = err.error.non_field_errors;
              }
              if (err.error.start_time) {
                this.timeslotForm.controls['start_time'].setErrors({
                  apiError: err.error.start_time
                });
              }
              if (err.error.end_time) {
                this.timeslotForm.controls['end_time'].setErrors({
                  apiError: err.error.end_time
                });
              }
            }
          );
        }
      }
    }
  }

  handleSuccessCreation() {
    this.notificationService.success(
      _('shared.notifications.commons.added.title')
    );
    this.refreshTimeslotList();
    this.toggleModal('form_timeslots');
  }

  removeTimeslot(item = null, force = false) {
    if (!item && !this.timeslotInDeletion) {
      console.error('No one timeslot given in argument');
    } else {
      if (item) {
        this.timeslotInDeletion = item;
      }
      if (this.timeslotInDeletion.number_of_reservations > 0 && !force) {
        this.toggleModal(
          'validation_deletion',
          _('period.validation_deletion_modal.title'),
          _('period.validation_deletion_modal.button')
        );
      } else {
        this.timeslotService.remove(this.timeslotInDeletion, force, this.messageOnDeletion).subscribe(
          data => {
            this.notificationService.success(
              _('shared.notifications.delete_bloc.title'),
              _('shared.notifications.delete_bloc.content')
            );
            this.refreshTimeslotList();
          },
          err => {
            this.notificationService.error(
              _('shared.notifications.fail_deletion_bloc.title'),
              _('shared.notifications.fail_deletion_bloc.content')
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

  timeslotAdapter(timeslot) {
    return {
      id: timeslot.id,
      url: timeslot.url,
      start_time: timeslot.getStartDay() + ' - ' + timeslot.getStartTime(),
      end_time: timeslot.getStartDay() + ' - ' + timeslot.getEndTime(),
      display_reservations: timeslot.reservations.length + ' / ' + timeslot.workplace.seats,
      number_of_reservations: timeslot.reservations.length
    };
  }

  goToTimeslot(event) {
    this.router.navigate(['/admin/timeslot/' + event.id]);
  }

  changePage(index: number) {
    this.page = index;
    this.refreshTimeslotList();
  }

  changeLimit(newLimit) {
    this.limit = newLimit;
    this.page = 1;
    this.refreshTimeslotList();
  }

  isSecurityOnDeletionValid() {
    return this.securityOnDeletion;
  }

  setDisplayOnlyFutureTimeslot(value) {
    this.displayOnlyFutureTimeslot = value;
    this.refreshTimeslotList();
  }

  resetTimeslotData() {
    this.listAdaptedTimeslots = null;
    this.listTimeslots = null;
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
