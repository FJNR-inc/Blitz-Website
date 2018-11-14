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
import {TranslateService} from '@ngx-translate/core';

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
      label: 'shared.form.name_in_french'
    },
    {
      name: 'name_en',
      type: 'text',
      label: 'shared.form.name_in_english'
    },
    {
      name: 'details_fr',
      type: 'textarea',
      label: 'shared.form.description_in_french'
    },
    {
      name: 'details_en',
      type: 'textarea',
      label: 'shared.form.description_in_english'
    },
    {
      name: 'seats',
      type: 'number',
      label: 'shared.form.seats'
    },
    {
      name: 'address_line1_fr',
      type: 'text',
      label: 'shared.form.address_line1_in_french'
    },
    {
      name: 'address_line2_fr',
      type: 'text',
      label: 'shared.form.address_line2_in_french'
    },
    {
      name: 'address_line1_en',
      type: 'text',
      label: 'shared.form.address_line1_in_english'
    },
    {
      name: 'address_line2_en',
      type: 'text',
      label: 'shared.form.address_line2_in_english'
    },
    {
      name: 'postal_code',
      type: 'text',
      label: 'shared.form.postal_code'
    },
    {
      name: 'city_fr',
      type: 'text',
      label: 'shared.form.city_in_french'
    },
    {
      name: 'city_en',
      type: 'text',
      label: 'shared.form.city_in_english'
    },
    {
      name: 'state_province_fr',
      type: 'text',
      label: 'shared.form.state_province_in_french'
    },
    {
      name: 'state_province_en',
      type: 'text',
      label: 'shared.form.state_province_in_english'
    },
    {
      name: 'country_fr',
      type: 'text',
      label: 'shared.form.country_in_french'
    },
    {
      name: 'country_en',
      type: 'text',
      label: 'shared.form.country_in_english'
    }
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private workplaceService: WorkplaceService,
              private periodService: PeriodService,
              private formBuilder: FormBuilder,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private pictureService: PictureService,
              private translate: TranslateService) { }

  ngOnInit() {
    this.translateItems();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.workplaceId = params['id'];
      this.refreshWorkplace();
    });

    const formUtil = new FormUtil();
    this.workplaceForm = formUtil.createFormGroup(this.workplaceFields);
  }

  translateItems() {
    for (const field of this.workplaceFields) {
      this.translate.get(field.label).subscribe(
        (translatedLabel: string) => {
          field.label = translatedLabel;
        }
      );
    }
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
        this.notificationService.success('shared.notifications.add_picture.title', 'shared.notifications.add_picture.content');
      },
      err => {
        this.notificationService.error('shared.notifications.fail_add.title', 'shared.notifications.fail_add.content');
      }
    );
  }

  onRemoved(event) {
    for (const picture of this.listPictures) {
      if (picture.id === event.id) {
        this.pictureService.remove(picture).subscribe(
          data => {
            this.notificationService.success('shared.notifications.delete_picture.title', 'shared.notifications.delete_picture.content');
            this.refreshListPictures();
          },
          err => {
            this.notificationService.error('shared.notifications.fail_deletion.title', 'shared.notifications.fail_deletion.content');
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
          this.notificationService.success('shared.notifications.commons.added.title');
          this.refreshWorkplace();
          this.toogleModal('form_workplaces');
        },
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
          } else {
            this.translate.get('shared.form.errors.unknown').subscribe(
              (translatedLabel: string) => {
                this.errors =  [translatedLabel];
              }
            );
          }
          this.workplaceForm = FormUtil.manageFormErrors(this.workplaceForm, err);
        }
      );
    }
  }
}
