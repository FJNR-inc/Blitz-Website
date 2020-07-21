import { Component, OnInit } from '@angular/core';
import {_} from "@biesbjerg/ngx-translate-extract/dist/utils/utils";
import {isNull} from "util";
import {RetreatTypeService} from "../../../../services/retreat-type.service";
import {RetreatType} from "../../../../models/retreatType";
import {FormUtil} from "../../../../utils/form";
import {FormGroup} from "@angular/forms";
import {MyNotificationService} from "../../../../services/my-notification/my-notification.service";
import {MyModalService} from "../../../../services/my-modal/my-modal.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-retreat-types',
  templateUrl: './retreat-types.component.html',
  styleUrls: ['./retreat-types.component.scss']
})
export class RetreatTypesComponent implements OnInit {

  listRetreatTypes: RetreatType[];

  settings = {
    title: _('retreat-types.retreat-types'),
    noDataText: _('retreat-types.no_retreat_types'),
    addButton: true,
    editButton: true,
    removeButton: true,
    clickable: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('retreat-types.form.name')
      }
    ]
  };

  retreatTypeForm: FormGroup;
  retreatTypeErrors: string[];
  selectedRetreatTypeUrl: string;

  retreatTypeFields = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('retreat-types.form.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('retreat-types.form.name_in_english')
    },
    {
      name: 'minutes_before_display_link',
      type: 'number',
      label: _('retreat-types.form.minutes_before_display_link')
    }
  ];

  constructor(private retreatTypeService: RetreatTypeService,
              private notificationService: MyNotificationService,
              private myModalService: MyModalService,
              private router: Router) { }

  ngOnInit() {
    this.refreshRetreatList();
    const formUtil = new FormUtil();
    this.retreatTypeForm = formUtil.createFormGroup(this.retreatTypeFields);
  }

  refreshRetreatList(page = 1, limit = 20) {
    this.retreatTypeService.list([], limit, limit * (page - 1)).subscribe(
      retreats => {
        this.settings.numberOfPage = Math.ceil(retreats.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(retreats.previous);
        this.settings.next = !isNull(retreats.next);
        this.listRetreatTypes = retreats.results.map(
          retreat => new RetreatType(retreat)
        );
      }
    );
  }

  onSelectItem(item) {
      this.router.navigate(['/admin/retreats/type/' + item.id]);
  }

  OpenModalCreate() {
    this.retreatTypeForm.reset();
    this.selectedRetreatTypeUrl = null;
    this.toggleModal(
      'form_retreat_types',
      _('retreat-types.modal_add'),
      _('retreat-types.create_modal.button')
    );
  }

  OpenModalEdit(item) {
    for (const retreatType of this.listRetreatTypes) {
      if (item.id === retreatType.id) {
        this.retreatTypeForm.controls['name_fr'].setValue(retreatType.name_fr);
        this.retreatTypeForm.controls['name_en'].setValue(retreatType.name_en);
        this.retreatTypeForm.controls['minutes_before_display_link'].setValue(retreatType.minutes_before_display_link);
        this.selectedRetreatTypeUrl = item.url;
        this.toggleModal(
          'form_retreat_types',
          _('retreat-types.modal_edit'),
          _('retreat-types.edit_modal.button')
        );
      }
    }
  }

  submitRetreatType() {
    if ( this.retreatTypeForm.valid ) {
      if (this.selectedRetreatTypeUrl) {
        this.retreatTypeService.update(this.selectedRetreatTypeUrl, this.retreatTypeForm.value).subscribe(
          data => {
            this.notificationService.success('retreat-types.notifications.commons.updated.title');
            this.refreshRetreatList();
            this.toggleModal('form_retreat_types');
          },
          err => {
            if (err.error.non_field_errors) {
              this.retreatTypeErrors = err.error.non_field_errors;
            } else {
              this.retreatTypeErrors =  ['retreat-types.form.errors.unknown'];
            }
            this.retreatTypeForm = FormUtil.manageFormErrors(this.retreatTypeForm, err);
          }
        );
      } else {
        this.retreatTypeService.create(this.retreatTypeForm.value).subscribe(
          data => {
            this.notificationService.success('retreat-types.notifications.commons.added.title');
            this.refreshRetreatList();
            this.toggleModal('form_retreat_types');
          },
          err => {
            if (err.error.non_field_errors) {
              this.retreatTypeErrors = err.error.non_field_errors;
            } else {
              this.retreatTypeErrors =  ['retreat-types.form.errors.unknown'];
            }
            this.retreatTypeForm = FormUtil.manageFormErrors(this.retreatTypeForm, err);
          }
        );
      }
    }
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

  removeRetreatType() {
    this.toggleModal(
      'info_deletion',
      _('retreat-types.delete_retreat_type_modal.title'),
      _('retreat-types.delete_retreat_type_modal.button')
    );
  }
}
