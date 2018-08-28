import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { NotificationsService } from 'angular2-notifications';
import { Period } from '../../../../models/period';
import { PeriodService } from '../../../../services/period.service';
import { TimeSlot } from '../../../../models/timeSlot';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isNull } from 'util';

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
  selectedTimeslot: any = null;

  settings = {
    title: 'Liste des plages horaires:',
    noDataText: 'Aucune plage horaire pour le moment',
    addButton: true,
    editButton: true,
    removeButton: true,
    clickable: true,
    columns: [
      {
        name: 'start_time',
        title: 'Date de début'
      },
      {
        name: 'end_time',
        title: 'Date de fin'
      },
      {
        name: 'number_of_reservations',
        title: 'Nombre de reservations'
      }
    ]
  };

  constructor(private periodService: PeriodService,
              private myModalService: MyModalService,
              private notificationService: NotificationsService,
              private formBuilder: FormBuilder,
              private timeslotService: TimeSlotService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

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

  refreshTimeslotList() {
    this.timeslotService.list([{'name': 'period', 'value': this.period.id}]).subscribe(
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
    this.resetForm();
    this.timeslotForm.controls['period'].setValue(this.period.url);
    this.selectedTimeslot = null;
    this.toogleModal('form_timeslots', 'Ajouter une plage horaire', 'Créer');
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
    this.toogleModal('form_timeslots', 'Éditer une plage horaire', 'Éditer');
  }

  submitTimeslot() {
    if ( this.timeslotForm.valid ) {
      const value = this.timeslotForm.value;
      if (isNull(value.custom_message)) {
        delete value['custom_message'];
      }
      if (this.selectedTimeslot) {
        if (this.selectedTimeslot.number_of_reservations > 0 && value.force_update === false) {
          this.timeslotForm.controls['force_update'].setErrors({
            apiError: ['Vous devez comprendre les repercutions de cet acte avant de valider!']
          });
        } else {
          this.timeslotService.update(this.selectedTimeslot.url, value).subscribe(
            data => {
              this.notificationService.success('Modifié');
              this.refreshTimeslotList();
              this.toogleModal('form_timeslots');
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
        this.timeslotService.create(value).subscribe(
          data => {
            this.notificationService.success('Ajouté');
            this.refreshTimeslotList();
            this.toogleModal('form_timeslots');
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

  removeTimeslot(item) {
    this.timeslotService.remove(item).subscribe(
      data => {
        this.notificationService.success('Supprimé', 'La plage horaire a bien été supprimé.');
        this.refreshTimeslotList();
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

  timeslotAdapter(timeslot) {
    return {
      id: timeslot.id,
      url: timeslot.url,
      start_time: timeslot.getStartDay() + ' - ' + timeslot.getStartTime(),
      end_time: timeslot.getStartDay() + ' - ' + timeslot.getEndTime(),
      number_of_reservations: timeslot.users.length
    };
  }

  goToTimeslot(event) {
    this.router.navigate(['/admin/timeslot/' + event.id]);
  }
}
