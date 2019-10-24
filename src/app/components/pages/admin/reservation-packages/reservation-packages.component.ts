import { Component, OnInit } from '@angular/core';
import { ReservationPackage } from '../../../../models/reservationPackage';
import { ReservationPackageService } from '../../../../services/reservation-package.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { MyModalService } from '../../../../services/my-modal/my-modal.service';
import { isNull } from 'util';
import { Membership } from '../../../../models/membership';
import { MembershipService } from '../../../../services/membership.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {FormUtil} from '../../../../utils/form';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-reservation-packages',
  templateUrl: './reservation-packages.component.html',
  styleUrls: ['./reservation-packages.component.scss']
})
export class ReservationPackagesComponent implements OnInit {

  listReservationPackages: ReservationPackage[];
  listMemberships: Membership[] = [];
  listAdaptedReservationPackages: any[];

  reservationPackageForm: FormGroup;
  reservationPackageErrors: string[];
  selectedReservationPackageUrl: string;

  settings = {
    title: _('reservation-packages.package'),
    noDataText: _('reservation-packages.no_package'),
    addButton: true,
    editButton: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('reservation-packages.common.name')
      },
      {
        name: 'price',
        title: _('reservation-packages.common.price')
      },
      {
        name: 'reservations',
        title: _('reservation-packages.common.number_of_reservation')
      },
      {
        name: 'available',
        title: _('reservation-packages.common.available'),
        type: 'boolean'
      }
    ]
  };

  fields = [
    {
      name: 'name_fr',
      type: 'text',
      label: _('reservation-packages.form.name_in_french')
    },
    {
      name: 'name_en',
      type: 'text',
      label: _('reservation-packages.form.name_in_english')
    },
    {
      name: 'price',
      type: 'number',
      label: _('reservation-packages.form.price')
    },
    {
      name: 'reservations',
      type: 'number',
      label: _('reservation-packages.form.number_of_reservation')
    },
    {
      name: 'exclusive_memberships',
      type: 'choices',
      label: _('reservation-packages.form.membership_allowed'),
      choices: []
    },
    {
      name: 'warning',
      type: 'alert',
      label: _('reservation-package.labels.alert_limitation_membership')
    },
    {
      name: 'available',
      type: 'checkbox',
      label: _('reservation-packages.form.available'),
    },
  ];

  constructor(private reservationPackageService: ReservationPackageService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private membershipService: MembershipService) { }

  ngOnInit() {
    this.refreshReservationPackageList();
    this.refreshMembershipList();
  }

  initForm(membershipsSelected) {
    const formUtil = new FormUtil();
    this.updateFields(membershipsSelected);
    this.reservationPackageForm = formUtil.createFormGroup(this.fields);
  }

  updateFields(membershipsSelected = []) {
    for (const field of this.fields) {
      if (field.name === 'exclusive_memberships') {
        field['choices'] = [];
        for (const membership of this.listMemberships) {
          const choice = {
            label: membership.name,
            value: membershipsSelected.indexOf(membership.url) > -1
          };
          field['choices'].push(choice);
        }
      }
    }
  }

  changePage(index: number) {
    this.refreshReservationPackageList(index);
  }

  refreshReservationPackageList(page = 1, limit = 20) {
    this.reservationPackageService.list(null, limit, limit * (page - 1)).subscribe(
      reservationPackages => {
        this.settings.numberOfPage = Math.ceil(reservationPackages.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(reservationPackages.previous);
        this.settings.next = !isNull(reservationPackages.next);
        this.listReservationPackages = reservationPackages.results.map(o => new ReservationPackage(o));
        this.listAdaptedReservationPackages = [];
        for (const reservationPackage of this.listReservationPackages) {
          this.listAdaptedReservationPackages.push(this.reservationPackageAdapter(reservationPackage));
        }
      }
    );
  }

  refreshMembershipList() {
    this.membershipService.list().subscribe(
      memberships => {
        this.listMemberships = memberships.results.map(m => new Membership(m));
        this.initForm([]);
      }
    );
  }

  OpenModalCreateReservationPackage() {
    this.initForm([]);
    this.reservationPackageForm.reset();
    this.reservationPackageForm.controls['available'].setValue(false);
    this.selectedReservationPackageUrl = null;
    this.toogleModal(
      'form_reservation_packages',
      _('reservation-package.create_reservation_package_modal.title'),
      _('reservation-package.create_reservation_package_modal.button')
    );
  }

  OpenModalEditReservationPackage(item) {
    for (const reservationPackage of this.listReservationPackages) {
      if (reservationPackage.id === item.id) {
        this.initForm(reservationPackage.exclusive_memberships);
        this.reservationPackageForm.controls['name_fr'].setValue(reservationPackage.name_fr);
        this.reservationPackageForm.controls['name_en'].setValue(reservationPackage.name_en);
        this.reservationPackageForm.controls['price'].setValue(reservationPackage.price);
        this.reservationPackageForm.controls['reservations'].setValue(reservationPackage.reservations);
        this.reservationPackageForm.controls['available'].setValue(reservationPackage.available);
        this.selectedReservationPackageUrl = item.url;
        this.toogleModal(
          'form_reservation_packages',
          _('reservation-package.edit_reservation_package_modal.title'),
          _('reservation-package.edit_reservation_package_modal.button')
        );
      }
    }
  }

  submitReservationPackage() {
    if ( this.reservationPackageForm.valid ) {
      const reservationPackage = this.reservationPackageForm.value;
      const formArray = this.reservationPackageForm.get('exclusive_memberships') as FormArray;
      reservationPackage['exclusive_memberships'] = [];
      let index = 0;
      for (const control of formArray.controls) {
        if (control.value) {
          reservationPackage['exclusive_memberships'].push(this.listMemberships[index].url);
        }
        index++;
      }

      if (this.selectedReservationPackageUrl) {
        this.reservationPackageService.update(this.selectedReservationPackageUrl, reservationPackage).subscribe(
          data => {
            this.notificationService.success(
              _('reservation-packages.notifications.commons.updated.title')
            );
            this.refreshReservationPackageList();
            this.toogleModal('form_reservation_packages');
          },
          err => {
            if (err.error.non_field_errors) {
              this.reservationPackageErrors = err.error.non_field_errors;
            }
            this.reservationPackageForm = FormUtil.manageFormErrors(this.reservationPackageForm, err);
          }
        );
      } else {
        this.reservationPackageService.create(reservationPackage).subscribe(
          data => {
            this.notificationService.success(
              _('reservation-packages.notifications.commons.added.title')
            );
            this.refreshReservationPackageList();
            this.toogleModal('form_reservation_packages');
          },
          err => {
            if (err.error.non_field_errors) {
              this.reservationPackageErrors = err.error.non_field_errors;
            }
            this.reservationPackageForm = FormUtil.manageFormErrors(this.reservationPackageForm, err);
          }
        );
      }
    }
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

  reservationPackageAdapter(reservationPackage) {
    return {
      id: reservationPackage.id,
      url: reservationPackage.url,
      name: reservationPackage.name,
      price: reservationPackage.price,
      reservations: reservationPackage.reservations,
      available: reservationPackage.available,
    };
  }
}
