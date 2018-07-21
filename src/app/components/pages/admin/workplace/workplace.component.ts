import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Workplace } from '../../../../models/workplace';
import { WorkplaceService } from '../../../../services/workplace.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TimeSlot } from '../../../../models/timeSlot';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { NotificationsService } from 'angular2-notifications';
import { Picture } from '../../../../models/picture';
import { PictureService } from '../../../../services/picture.service';
import { environment } from '../../../../../environments/environment';
import {AuthenticationService} from "../../../../services/authentication.service";
import GlobalService from "../../../../services/globalService";

@Component({
  selector: 'app-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.scss']
})
export class WorkplaceComponent implements OnInit {

  workplaceId: number;
  workplace: Workplace;
  listTimeslots: TimeSlot[];
  listPictures: Picture[];
  listPicturesUpload: any[] = [];

  workplaceForm: FormGroup;
  errors: string[];

  settings = {
    addButton: true,
    editButton: true,
    removeButton: true,
    columns: [
      {
        name: 'period',
        title: 'Période'
      },
      {
        name: 'day',
        title: 'Jour'
      },
      {
        name: 'start',
        title: 'Début'
      },
      {
        name: 'end',
        title: 'Fin'
      },
      {
        name: 'price',
        title: 'Prix'
      }
    ]
  };

  constructor(private activatedRoute: ActivatedRoute,
              private workplaceService: WorkplaceService,
              private timeSlotService: TimeSlotService,
              private formBuilder: FormBuilder,
              private myModalService: MyModalService,
              private notificationService: NotificationsService,
              private pictureService: PictureService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.workplaceId = params['id'];
      this.refreshWorkplace();
    });

    this.workplaceForm = this.formBuilder.group(
      {
        name: null,
        details: null,
        seats: null,
        address_line1: null,
        address_line2: null,
        postal_code: null,
        city: null,
        state_province: null,
        country: null,
        timezone: null,
      }
    );
  }

  refreshWorkplace() {
    this.workplaceService.get(this.workplaceId).subscribe(
      data => {
        this.workplace = new Workplace(data);
        this.timeSlotService.list([{'name': 'workplace', 'value': this.workplaceId}]).subscribe(
          timeslots => {
            this.listTimeslots = timeslots.results.map(
              t => this.timeSlotAdapter(new TimeSlot(t))
            );
          }
        );
        this.pictureService.list([{'name': 'workplace', 'value': this.workplaceId}]).subscribe(
          pictures => {
            this.listPictures = pictures.results.map(
              p => new Picture(p)
            );
          }
        );
      }
    );
  }

  removePicture(picture) {
    this.pictureService.remove(picture).subscribe(
      data => {
        this.notificationService.success('Supprimé', 'La photo a bien été supprimé.');
        this.refreshWorkplace();
      },
      err => {
        this.notificationService.error('Erreur', 'Echec de la tentative de suppression.');
      }
    );
  }

  timeSlotAdapter(timeSlot) {
    return {
      id: timeSlot.id,
      day: timeSlot.getStartDay(),
      start: timeSlot.getStartTime(),
      end: timeSlot.getEndTime(),
      period: timeSlot.period.name,
      price: timeSlot.price
    };
  }

  OpenModalAddPicture() {
    this.toogleModal('form_add_picture', 'Ajouter une photo', 'Ajouter');
  }

  onUploadFinished(event) {
    this.listPicturesUpload.push(event);
  }

  addPicture() {
    for (const picture of this.listPicturesUpload) {
      const newPicture = new Picture({
        picture: picture.src,
        name: picture.file.name,
        workplace: this.workplace.url
      });
      this.pictureService.create(newPicture).subscribe(
        data => {
          this.notificationService.success('Ajouté');
          this.refreshWorkplace();
          this.toogleModal('form_add_picture');
        },
        err => {
          this.notificationService.error('Erreur');
        }
      );
    }
  }

  OpenModalEditWorkplace() {
    this.workplaceForm.reset();
    this.workplaceForm.controls['name'].setValue(this.workplace.name);
    this.workplaceForm.controls['details'].setValue(this.workplace.details);
    this.workplaceForm.controls['seats'].setValue(this.workplace.seats);
    this.workplaceForm.controls['address_line1'].setValue(this.workplace.address_line1);
    this.workplaceForm.controls['address_line2'].setValue(this.workplace.address_line2);
    this.workplaceForm.controls['postal_code'].setValue(this.workplace.postal_code);
    this.workplaceForm.controls['city'].setValue(this.workplace.city);
    this.workplaceForm.controls['state_province'].setValue(this.workplace.state_province);
    this.workplaceForm.controls['country'].setValue(this.workplace.country);
    this.workplaceForm.controls['timezone'].setValue(this.workplace.timezone);
    this.toogleModal('form_workplaces', 'Editer un espace de travail', 'Editer');
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

  submitWorkplace() {
    const value = this.workplaceForm.value;
    if (value['address_line2'] === '') {
      value['address_line2'] = null;
    }
    if ( this.workplaceForm.valid ) {
      this.workplaceService.update(this.workplace.url, value).subscribe(
        data => {
          this.notificationService.success('Ajouté');
          this.refreshWorkplace();
          this.toogleModal('form_workplaces');
        },
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
            console.log(this.errors);
          }
          if (err.error.name) {
            this.workplaceForm.controls['name'].setErrors({
              apiError: err.error.name
            });
          }
          if (err.error.details) {
            this.workplaceForm.controls['details'].setErrors({
              apiError: err.error.details
            });
          }
          if (err.error.seats) {
            this.workplaceForm.controls['seats'].setErrors({
              apiError: err.error.seats
            });
          }
          if (err.error.address_line1) {
            this.workplaceForm.controls['address_line1'].setErrors({
              apiError: err.error.address_line1
            });
          }
          if (err.error.address_line2) {
            this.workplaceForm.controls['address_line2'].setErrors({
              apiError: err.error.address_line2
            });
          }
          if (err.error.postal_code) {
            this.workplaceForm.controls['postal_code'].setErrors({
              apiError: err.error.postal_code
            });
          }
          if (err.error.city) {
            this.workplaceForm.controls['city'].setErrors({
              apiError: err.error.city
            });
          }
          if (err.error.country) {
            this.workplaceForm.controls['country'].setErrors({
              apiError: err.error.country
            });
          }
          if (err.error.state_province) {
            this.workplaceForm.controls['state_province'].setErrors({
              apiError: err.error.state_province
            });
          }
          if (err.error.timezone) {
            this.workplaceForm.controls['timezone'].setErrors({
              apiError: err.error.timezone
            });
          }
        }
      );
    }
  }
}
