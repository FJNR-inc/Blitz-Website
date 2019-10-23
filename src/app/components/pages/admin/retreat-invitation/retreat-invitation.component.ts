import {Component, Input, OnInit} from '@angular/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {RetreatInvitationService} from '../../../../services/retreat-invitation.service';
import {RetreatInvitation} from '../../../../models/RetreatInvitation';
import {Retreat} from '../../../../models/retreat';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {FormGroup} from '@angular/forms';
import {CouponService} from '../../../../services/coupon.service';
import {Coupon} from '../../../../models/coupon';
import {FormUtil} from '../../../../utils/form';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {TableSetting} from '../../../my-table/my-table.component';

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

@Component({
  selector: 'app-retreat-invitation',
  templateUrl: './retreat-invitation.component.html',
  styleUrls: ['./retreat-invitation.component.scss']
})
export class RetreatInvitationComponent implements OnInit {

  @Input()
  retreat: Retreat;

  settings: TableSetting = {
    title: _('retreat-invitation.title_table'),
    noDataText: _('retreat-invitation.no_reservation'),
    addButton: true,
    clickable: false,
    previous: false,
    editButton: true,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('retreat-invitation.common.name')
      }, {
        name: 'nb_places',
        title: _('retreat-invitation.common.nb_places')
      }, {
        name: 'nb_places_used',
        title: _('retreat-invitation.common.nb_places_used')
      }, {
        name: 'reserve_seat',
        type: 'boolean',
        title: _('retreat-invitation.common.reserve_seat')
      }, {
        name: 'front_url',
        title: _('retreat-invitation.common.front_url')
      },
    ]
  };

  retreatInvitations: RetreatInvitation[];

  selectedInvitation: RetreatInvitation;

  invitationForm: FormGroup;
  errors: string[];

  invitationFields: Field[] = [
    {
      name: 'name',
      type: 'text',
      label: _('retreat-invitation.form.name')
    },
    {
      name: 'nb_places',
      type: 'number',
      label: _('retreat-invitation.form.nb_place')
    },
    {
      name: 'reserve_seat',
      type: 'boolean',
      label: _('retreat-invitation.form.nb_reserved')
    },
    {
      name: 'coupon',
      type: 'select',
      label: _('retreat-invitation.form.coupon'),
      choices: []
    }
  ];

  constructor(
    private retreatInvitationService: RetreatInvitationService,
    private myModalService: MyModalService,
    private couponService: CouponService,
    private notificationService: MyNotificationService,
  ) { }

  ngOnInit() {
    this.refreshInvitations();
  }

  refreshInvitations() {
    this.retreatInvitationService
      .list([{name: 'retreat', value: this.retreat.id}])
      .subscribe(data =>
        this.retreatInvitations = data.results
      );
  }


  refreshCoupon() {
    this.couponService.list().subscribe(
      data => {
        const coupons: Coupon[] = data.results;
        this.couponField.choices = [];

        coupons.forEach((coupon: Coupon) => {
          const choice: Choice = {
            value: coupon.url,
            label: coupon.code
          };
          this.couponField.choices.push(choice);

          const formUtil = new FormUtil();
          this.invitationForm = formUtil.createFormGroup(this.invitationFields);
          this.fillForm();
        });
      }
    );
  }

  addInvitation() {
    const modal = this.myModalService.get('form_retreat_invitations');

    if (!modal) {
      return;
    }

    modal.title = _('retreat-invitation.form.modal_add_title');
    modal.button2Label = _('retreat-invitation.form.modal_add_btn');
    this.selectedInvitation = null;
    this.refreshCoupon();
    modal.toggle();
  }

  editInvitation(invitation: RetreatInvitation) {
    const modal = this.myModalService.get('form_retreat_invitations');

    if (!modal) {
      return;
    }

    modal.title = _('retreat-invitation.form.modal_edit_title');
    modal.button2Label = _('retreat-invitation.form.modal_edit_btn');
    this.selectedInvitation = invitation;
    this.refreshCoupon();
    modal.toggle();
  }


  fillForm() {
    if (this.selectedInvitation) {
      this.invitationForm.patchValue(this.selectedInvitation);
    }
  }


  submitInvitation() {
    if (this.selectedInvitation) {

      const data = {
        'coupon' : this.invitationForm.value.coupon,
        'nb_places': this.invitationForm.value.nb_places,
        'reserve_seat': this.invitationForm.value.reserve_seat,
      };

      this.retreatInvitationService
        .update(this.selectedInvitation, data).subscribe(
        () => {
          this.refreshInvitations();
          this.myModalService.get('form_retreat_invitations').close();
          this.notificationService.success(
            _('retreat-invitation.notifications.commons.updated.title')
          );
        },
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
          } else {
            this.errors =  ['retreat-invitation.form.errors.unknown'];
          }
          this.invitationForm = FormUtil.manageFormErrors(this.invitationForm, err);
        }
        );

    } else {

      const invitation: RetreatInvitation = this.invitationForm.value;
      invitation.retreat = this.retreat.url;

      this.retreatInvitationService
        .create(invitation).subscribe(
        () => {
          this.refreshInvitations();
          this.myModalService.get('form_retreat_invitations').close();
          this.notificationService.success(
            _('retreat-invitation.notifications.commons.added.title')
          );
        }  ,
        err => {
          if (err.error.non_field_errors) {
            this.errors = err.error.non_field_errors;
          } else {
            this.errors =  ['retreat-invitation.form.errors.unknown'];
          }
          this.invitationForm = FormUtil.manageFormErrors(this.invitationForm, err);
        }
      );
    }
  }

  get couponField(): Field{
    return this.invitationFields.find(field => field.name === 'coupon');
  }

}
