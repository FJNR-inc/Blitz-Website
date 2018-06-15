import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { NotificationsService } from 'angular2-notifications';
import { Period } from '../../../../models/period';
import { PeriodService } from '../../../../services/period.service';
import { TimeSlot } from '../../../../models/timeSlot';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss']
})
export class PeriodComponent implements OnInit {

  period: Period;
  listTimeslots: TimeSlot[];
  listAdaptedTimeslots: any[];

  timeslotForm: FormGroup;
  timeslotErrors: string[];
  selectedTimeslotUrl: string;

  settings = {
    addButton: true,
    editButton: true,
    removeButton: true,
    columns: [
      {
        name: 'start_time',
        title: 'Date de debut'
      },
      {
        name: 'end_time',
        title: 'Date de fin'
      }
    ]
  };

  constructor(private periodService: PeriodService,
              private myModalService: MyModalService,
              private notificationService: NotificationsService,
              private formBuilder: FormBuilder,
              private timeslotService: TimeSlotService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.periodService.get(params['id']).subscribe(
        period => {
          this.period = new Period(period);
          this.refreshTimeslotList();
        }
      );
    });

    this.timeslotForm = this.formBuilder.group(
      {
        start_time: null,
        end_time: null,
        period: null,
        price: null,
      }
    );
  }

  refreshTimeslotList() {
    this.timeslotService.list().subscribe(
      timeslots => {
        this.listTimeslots = timeslots.results.map(t => new TimeSlot(t));
        this.listAdaptedTimeslots = [];
        for (const timeslot of this.listTimeslots) {
          this.listAdaptedTimeslots.push(this.timeslotAdapter(timeslot));
        }
      }
    );
  }

  OpenModalCreateTimeslot() {
    this.timeslotForm.reset();
    this.timeslotForm.controls['period'].setValue(this.period.url);
    this.timeslotForm.controls['price'].setValue(1);
    this.selectedTimeslotUrl = null;
    this.toogleModal('form_timeslots', 'Ajouter une plage horaire', 'Creer');
  }

  OpenModalEditTimeslot(item) {
    for (const timeslot of this.listTimeslots) {
      if (timeslot.id === item.id) {
        this.timeslotForm.controls['start_time'].setValue(timeslot.start_time);
        this.timeslotForm.controls['end_time'].setValue(timeslot.end_time);
        this.timeslotForm.controls['period'].setValue(this.period.url);
        this.timeslotForm.controls['price'].setValue(1);
      }
    }
    this.selectedTimeslotUrl = item.url;
    this.toogleModal('form_timeslots', 'Editer une plage horaire', 'Editer');
  }

  submitTimeslot() {
    if ( this.timeslotForm.valid ) {
      if (this.selectedTimeslotUrl) {
        this.timeslotService.update(this.selectedTimeslotUrl, this.timeslotForm.value).subscribe(
          data => {
            this.notificationService.success('Modifié');
            this.refreshTimeslotList();
            this.toogleModal('form_timeslots');
          },
          err => {
            if (err.error.non_field_errors) {
              this.timeslotErrors = err.error.non_field_errors;
              console.log(this.timeslotErrors);
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
        this.timeslotService.create(this.timeslotForm.value).subscribe(
          data => {
            this.notificationService.success('Ajouté');
            this.refreshTimeslotList();
            this.toogleModal('form_timeslots');
          },
          err => {
            if (err.error.non_field_errors) {
              this.timeslotErrors = err.error.non_field_errors;
              console.log(this.timeslotErrors);
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

  removeTimeslot(item) {
    this.timeslotService.remove(item).subscribe(
      data => {
        this.notificationService.success('Supprimé', 'La plage horaire a bien été supprimé.');
        this.refreshTimeslotList();
      },
      err => {
        console.log(err);
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

  timeslotAdapter(timeslot) {
    return {
      id: timeslot.id,
      url: timeslot.url,
      start_time: timeslot.getStartDay() + ' - ' + timeslot.getStartTime(),
      end_time: timeslot.getStartDay() + ' - ' + timeslot.getEndTime(),
    };
  }
}
