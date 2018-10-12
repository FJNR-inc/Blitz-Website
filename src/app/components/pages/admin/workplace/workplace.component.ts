import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { Workplace } from '../../../../models/workplace';
import { WorkplaceService } from '../../../../services/workplace.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { NotificationsService } from 'angular2-notifications';
import { Picture } from '../../../../models/picture';
import { PictureService } from '../../../../services/picture.service';
import {PeriodService} from '../../../../services/period.service';

@Component({
  selector: 'app-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.scss']
})
export class WorkplaceComponent implements OnInit {

  workplaceId: number;
  workplace: Workplace;
  listPictures: Picture[];
  listPicturesAdapted: any[] = [];

  workplaceForm: FormGroup;
  errors: string[];

  customStyle = {
    clearButton: {
      'display': 'none'
    },
  };

  constructor(private activatedRoute: ActivatedRoute,
              private workplaceService: WorkplaceService,
              private periodService: PeriodService,
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
      }
    );
  }

  refreshWorkplace() {
    this.workplaceService.get(this.workplaceId).subscribe(
      data => {
        this.workplace = new Workplace(data);
        this.pictureService.list([{'name': 'workplace', 'value': this.workplaceId}]).subscribe(
          pictures => {
            this.listPictures = pictures.results.map(
              p => new Picture(p)
            );
            this.listPicturesAdapted = [];
            for (const picture of this.listPictures) {
              this.listPicturesAdapted.push({
                'fileName': picture.name,
                'url': picture.picture
              });
            }
          }
        );
      }
    );
  }

  onUploadFinished(event) {
    const newPicture = new Picture({
      picture: event.file,
      name: event.file.name,
      workplace: this.workplace.url
    });
    this.pictureService.create(newPicture).subscribe(
      data => {
        this.listPictures.push(new Picture(data));
        this.notificationService.success('Ajouté');
      },
      err => {
        this.notificationService.error('Erreur');
      }
    );
  }

  onRemoved(event) {
    for (const picture of this.listPictures) {
      if (picture.name === event.file.name) {
        this.pictureService.remove(picture).subscribe(
          data => {
            this.notificationService.success('Supprimé', 'La photo a bien été supprimé.');
          },
          err => {
            this.notificationService.error('Erreur', 'Echec de la tentative de suppression.');
          }
        );
      }
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
    this.toogleModal('form_workplaces', 'Éditer un espace de travail', 'Éditer l\'espace');
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
    value['timezone'] = 'America/Montreal';
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
        }
      );
    }
  }
}
