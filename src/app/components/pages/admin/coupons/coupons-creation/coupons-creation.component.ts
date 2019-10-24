import {Component, Input, OnInit} from '@angular/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {FormUtil} from '../../../../../utils/form';
import {FormGroup} from '@angular/forms';
import {Retreat} from '../../../../../models/retreat';
import {RetreatService} from '../../../../../services/retreat.service';
import {AuthenticationService} from '../../../../../services/authentication.service';
import {MyNotificationService} from '../../../../../services/my-notification/my-notification.service';
import {CouponService} from '../../../../../services/coupon.service';
import {Membership} from '../../../../../models/membership';
import {MembershipService} from '../../../../../services/membership.service';
import {ReservationPackage} from '../../../../../models/reservationPackage';
import {ReservationPackageService} from '../../../../../services/reservation-package.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Coupon} from '../../../../../models/coupon';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-coupons-creation',
  templateUrl: './coupons-creation.component.html',
  styleUrls: ['./coupons-creation.component.scss']
})
export class CouponsCreationComponent implements OnInit {
  coupon: Coupon;

  fields = [
    {
      name: 'code',
      type: 'text',
      label: _('coupons-creation.form.coupon.code')
    },
    {
      name: 'type_of_value',
      type: 'select',
      choices: [
        {
          value: 'value',
          label: 'Value'
        },
        {
          value: 'percent_off',
          label: 'Percentage'
        }
      ],
      label: _('coupons-creation.form.coupon.type_of_value')
    },
    {
      name: 'value_of_coupon',
      type: 'number',
      label: _('coupons-creation.form.coupon.value')
    },
    {
      name: 'start_time',
      type: 'datetime',
      label: _('coupons-creation.form.coupon.start_time')
    },
    {
      name: 'end_time',
      type: 'datetime',
      label: _('coupons-creation.form.coupon.end_time')
    },
    {
      name: 'max_use',
      type: 'number',
      label: _('coupons-creation.form.coupon.max_use')
    },
    {
      name: 'max_use_per_user',
      type: 'number',
      label: _('coupons-creation.form.coupon.max_user_per_user')
    },
    {
      name: 'details',
      type: 'text',
      label: _('coupons-creation.form.coupon.details')
    }
  ];

  couponForm: FormGroup;
  couponErrors: string[];
  selectedCouponUrl: string;

  listRetreats: Retreat[] = [];
  selectedRetreats: Retreat[] = [];

  listMemberships: Membership[] = [];
  selectedMemberships: Membership[] = [];

  listPackages: ReservationPackage[] = [];
  selectedPackages: ReservationPackage[] = [];

  listTypeOfProduct: any[] = [
    {
      name: 'coupons-creation.listTypeOfProduct_retreat',
      value: 'retreat'
    },
    {
      name: 'coupons-creation.listTypeOfProduct_membership',
      value: 'membership'
    },
    {
      name: 'coupons-creation.listTypeOfProduct_timeslot',
      value: 'timeslot'
    },
    {
      name: 'coupons-creation.listTypeOfProduct_package',
      value: 'package'
    }
  ];
  selectedTypeOfProduct: any[] = [];

  constructor(private retreatService: RetreatService,
              private couponService: CouponService,
              private authenticationService: AuthenticationService,
              private notificationService: MyNotificationService,
              private membershipService: MembershipService,
              private packageService: ReservationPackageService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private translate: TranslateService) { }

  ngOnInit() {
    this.refreshRetreatList();
    this.refreshMembershipList();
    this.refreshPackageList();

    const formUtil = new FormUtil();
    this.couponForm = formUtil.createFormGroup(this.fields);

    this.activatedRoute.params.subscribe((params: Params) => {
      this.couponService.get(params['id']).subscribe(
        data => {
          this.coupon = new Coupon(data);
          this.couponForm.controls['code'].setValue(this.coupon.code);
          this.couponForm.controls['value_of_coupon'].setValue(this.coupon.getValue());
          this.couponForm.controls['type_of_value'].setValue(this.coupon.getTypeOfValue());
          this.couponForm.controls['start_time'].setValue(this.coupon.start_time);
          this.couponForm.controls['end_time'].setValue(this.coupon.end_time);
          this.couponForm.controls['max_use'].setValue(this.coupon.max_use);
          this.couponForm.controls['max_use_per_user'].setValue(this.coupon.max_use_per_user);
          this.couponForm.controls['details'].setValue(this.coupon.details);
          this.selectedRetreats = this.setSelectedRetreats();
          this.selectedPackages = this.setSelectedPackages();
          this.selectedTypeOfProduct = this.setSelectedTypeOfProduct();
          this.selectedMemberships = this.setSelectedMemberships();
        }
      );
    });
    this.translateIListTypeOfProduct();
  }

  refreshRetreatList(search = null) {
    let filters = null;
    if (search) {
      filters = [
        {
          'name': 'name',
          'value': search
        }
      ];
    }
    this.retreatService.list(filters).subscribe(
      retreats => {
        this.listRetreats = retreats.results.map(o => new Retreat(o));
      }
    );
  }

  translateIListTypeOfProduct() {
    for (const typeOfProduct of this.listTypeOfProduct) {
      this.translate.get(typeOfProduct.name).subscribe(
        (translatedLabel: string) => {
          typeOfProduct.name = translatedLabel;
        }
      );
    }
  }

  refreshMembershipList() {
    this.membershipService.list().subscribe(
      memberships => {
        this.listMemberships = memberships.results.map(m => new Membership(m));
      }
    );
  }

  refreshPackageList() {
    this.packageService.list().subscribe(
      packages => {
        this.listPackages = packages.results.map(p => new ReservationPackage(p));
      }
    );
  }


  setSelectedRetreats() {
    const selectedRetreats = [];
    for (const retreat of this.coupon.applicable_retreats) {
      selectedRetreats.push(retreat);
    }
    return selectedRetreats;
  }

  getSelectedRetreats() {
    const selectedRetreats = [];
    for (const retreat of this.selectedRetreats) {
      selectedRetreats.push(retreat.url);
    }
    return selectedRetreats;
  }

  setSelectedMemberships() {
    const selectedMemberships = [];
    for (const membership of this.coupon.applicable_memberships) {
      selectedMemberships.push(membership);
    }
    return selectedMemberships;
  }

  getSelectedMemberships() {
    const selectedMemberships = [];
    for (const retreat of this.selectedMemberships) {
      selectedMemberships.push(retreat.url);
    }
    return selectedMemberships;
  }

  setSelectedTypeOfProduct() {
    const selectedTypeOfProduct = [];
    for (const typeOfProduct of this.coupon.applicable_product_types) {
      for (const availableTypeOfProduct of this.listTypeOfProduct) {
        if (availableTypeOfProduct.value === typeOfProduct) {
          selectedTypeOfProduct.push(availableTypeOfProduct);
        }
      }
    }
    return selectedTypeOfProduct;
  }

  getSelectedTypeOfProduct() {
    const selectedTypeOfProduct = [];
    for (const typeOfProduct of this.selectedTypeOfProduct) {
      selectedTypeOfProduct.push(typeOfProduct.value);
    }
    return selectedTypeOfProduct;
  }

  setSelectedPackages() {
    const selectedPackages = [];
    for (const packageItem of this.coupon.applicable_packages) {
      selectedPackages.push(packageItem);
    }
    return selectedPackages;
  }

  getSelectedPackages() {
    const selectedPackages = [];
    for (const packageItem of this.selectedPackages) {
      selectedPackages.push(packageItem.url);
    }
    return selectedPackages;
  }

  submitCoupon() {
    if ( this.couponForm.valid ) {
      const value = this.couponForm.value;
      value['owner'] = this.authenticationService.getProfile().url;
      value['applicable_retreats'] = this.getSelectedRetreats();
      value['applicable_memberships'] = this.getSelectedMemberships();
      value['applicable_packages'] = this.getSelectedPackages();
      value['applicable_product_types'] = this.getSelectedTypeOfProduct();
      if (value['type_of_value'] === 'value') {
        value['value'] = value['value_of_coupon'];
        value['percent_off'] = 0;
      } else {
        value['percent_off'] = value['value_of_coupon'];
        value['value'] = 0;
      }

      if (this.coupon) {
        this.couponService.update(this.coupon.url, value).subscribe(
          data => {
            this.notificationService.success(
              _('coupons-creation.notifications.commons.updated.title')
            );
            this.router.navigate(['/admin/coupons']);
          },
          err => {
            if (err.error.non_field_errors) {
              this.couponErrors = err.error.non_field_errors;
            } else {
              this.couponErrors =  ['coupons-creation.form.errors.unknown'];
            }
            this.couponForm = FormUtil.manageFormErrors(this.couponForm, err);
          }
        );
      } else {
        this.couponService.create(value).subscribe(
          data => {
            this.notificationService.success(
              _('coupons-creation.notifications.commons.added.title')
            );
            this.router.navigate(['/admin/coupons']);
          },
          err => {
            if (err.error.non_field_errors) {
              this.couponErrors = err.error.non_field_errors;
            } else {
              this.couponErrors =  ['coupons-creation.form.errors.unknown'];
            }
            this.couponForm = FormUtil.manageFormErrors(this.couponForm, err);
          }
        );
      }
    }
  }

  filterRetreats(search) {
    this.refreshRetreatList(search);
  }
}
