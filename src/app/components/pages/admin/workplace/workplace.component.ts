import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { Workplace } from '../../../../models/workplace';
import { WorkplaceService } from '../../../../services/workplace.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { Picture } from '../../../../models/picture';
import { PictureService } from '../../../../services/picture.service';
import {PeriodService} from '../../../../services/period.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../../utils/form';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {AuthenticationService} from '../../../../services/authentication.service';

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

  workplaceFields = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('workplace.form.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('workplace.form.name_in_english')
    },
    {
      name: 'details_fr',
      type: 'textarea',
      label: _('workplace.form.description_in_french')
    },
    {
      name: 'details_en',
      type: 'textarea',
      label: _('workplace.form.description_in_english')
    },
    {
      name: 'seats',
      type: 'number',
      label: _('workplace.form.seats')
    },
    {
      name: 'address_line1_fr',
      type: 'text',
      label: _('workplace.form.address_line1_in_french')
    },
    {
      name: 'address_line2_fr',
      type: 'text',
      label: _('workplace.form.address_line2_in_french')
    },
    {
      name: 'address_line1_en',
      type: 'text',
      label: _('workplace.form.address_line1_in_english')
    },
    {
      name: 'address_line2_en',
      type: 'text',
      label: _('workplace.form.address_line2_in_english')
    },
    {
      name: 'postal_code',
      type: 'text',
      label: _('workplace.form.postal_code')
    },
    {
      name: 'city_fr',
      type: 'text',
      label: _('workplace.form.city_in_french')
    },
    {
      name: 'city_en',
      type: 'text',
      label: _('workplace.form.city_in_english')
    },
    {
      name: 'state_province_fr',
      type: 'text',
      label: _('workplace.form.state_province_in_french')
    },
    {
      name: 'state_province_en',
      type: 'text',
      label: _('workplace.form.state_province_in_english')
    },
    {
      name: 'country_fr',
      type: 'text',
      label: _('workplace.form.country_in_french')
    },
    {
      name: 'country_en',
      type: 'text',
      label: _('workplace.form.country_in_english')
    }
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private workplaceService: WorkplaceService,
              private periodService: PeriodService,
              private formBuilder: FormBuilder,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private pictureService: PictureService,
              public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.workplaceId = params['id'];
      this.refreshWorkplace();
    });

    const formUtil = new FormUtil();
    this.workplaceForm = formUtil.createFormGroup(this.workplaceFields);
  }

  refreshWorkplace() {
    this.workplaceService.get(this.workplaceId).subscribe(
      data => {
        this.workplace = new Workplace(data);
        this.refreshListPictures();
      }
    );
  }

  refreshListPictures() {
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

  onUploadFinished(event) {
    const newPicture = new Picture({
      picture: event,
      name: event.name,
      workplace: this.workplace.url
    });
    this.pictureService.create(newPicture).subscribe(
      data => {
        this.listPictures.push(new Picture(data));
        this.notificationService.success(
          _('workplace.notifications.add_picture.title'),
          _('workplace.notifications.add_picture.content')
        );
      },
      err => {
        this.notificationService.error(
          _('workplace.notifications.fail_add.title'),
          _('workplace.notifications.fail_add.content')
        );
      }
    );
  }

  onRemoved(event) {
    for (const picture of this.listPictures) {
      if (picture.id === event.id) {
        this.pictureService.remove(picture).subscribe(
          data => {
            this.notificationService.success(
              _('workplace.notifications.delete_picture.title'),
              _('workplace.notifications.delete_picture.content')
            );
            this.refreshListPictures();
          },
          err => {
            this.notificationService.error(
              _('workplace.notifications.fail_deletion.title'),
              _('workplace.notifications.fail_deletion.content')
            );
          }
        );
      }
    }
  }

  OpenModalEditWorkplace() {
    this.workplaceForm.reset();
    this.workplaceForm.controls['name_fr'].setValue(this.workplace.name_fr);
    this.workplaceForm.controls['name_en'].setValue(this.workplace.name_en);
    this.workplaceForm.controls['details_fr'].setValue(this.workplace.details_fr);
    this.workplaceForm.controls['details_en'].setValue(this.workplace.details_en);
    this.workplaceForm.controls['seats'].setValue(this.workplace.seats);
    this.workplaceForm.controls['address_line1_fr'].setValue(this.workplace.address_line1_fr);
    this.workplaceForm.controls['address_line2_fr'].setValue(this.workplace.address_line2_fr);
    this.workplaceForm.controls['address_line1_en'].setValue(this.workplace.address_line1_en);
    this.workplaceForm.controls['address_line2_en'].setValue(this.workplace.address_line2_en);
    this.workplaceForm.controls['postal_code'].setValue(this.workplace.postal_code);
    this.workplaceForm.controls['city_fr'].setValue(this.workplace.city_fr);
    this.workplaceForm.controls['city_en'].setValue(this.workplace.city_en);
    this.workplaceForm.controls['state_province_fr'].setValue(this.workplace.state_province_fr);
    this.workplaceForm.controls['state_province_en'].setValue(this.workplace.state_province_en);
    this.workplaceForm.controls['country_fr'].setValue(this.workplace.country_fr);
    this.workplaceForm.controls['country_en'].setValue(this.workplace.country_en);

    this.toogleModal(
      'form_workplaces',
      _('workplace.edit_workplace_modal.title'),
      _('workplace.edit_workplace_modal.button')
    );
  }

  toogleModal(name, title: string | string[] = '', button2: string | string[] = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
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
          this.notificationService.success(
            _('workplace.notifications.commons.added.title')
          );
          this.refreshWorkplace();
          this.toogleModal('form_workplaces');
        },
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
          } else {
            this.errors =  ['workplace.form.errors.unknown'];
          }
          this.workplaceForm = FormUtil.manageFormErrors(this.workplaceForm, err);
        }
      );
    }
  }
}
