import {Component, Input, OnInit} from '@angular/core';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {FormUtil} from '../../../../../utils/form';
import {FormGroup} from '@angular/forms';
import {Retirement} from '../../../../../models/retirement';
import {RetirementService} from '../../../../../services/retirement.service';
import {AuthenticationService} from '../../../../../services/authentication.service';
import {MyNotificationService} from '../../../../../services/my-notification/my-notification.service';
import {CouponService} from '../../../../../services/coupon.service';
import {Membership} from '../../../../../models/membership';
import {MembershipService} from '../../../../../services/membership.service';
import {ReservationPackage} from '../../../../../models/reservationPackage';
import {ReservationPackageService} from '../../../../../services/reservation-package.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Coupon} from '../../../../../models/coupon';

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
      label: _('shared.form.coupon.code')
    },
    {
      name: 'value',
      type: 'number',
      label: _('shared.form.coupon.value')
    },
    {
      name: 'start_time',
      type: 'datetime',
      label: _('shared.form.coupon.start_time')
    },
    {
      name: 'end_time',
      type: 'datetime',
      label: _('shared.form.coupon.end_time')
    },
    {
      name: 'max_use',
      type: 'number',
      label: _('shared.form.coupon.max_use')
    },
    {
      name: 'max_use_per_user',
      type: 'number',
      label: _('shared.form.coupon.max_user_per_user')
    },
    {
      name: 'details',
      type: 'text',
      label: _('shared.form.coupon.details')
    }
  ];

  couponForm: FormGroup;
  couponErrors: string[];
  selectedCouponUrl: string;

  listRetirements: Retirement[] = [];
  selectedRetirements: Retirement[] = [];

  listMemberships: Membership[] = [];
  selectedMemberships: Membership[] = [];

  listPackages: ReservationPackage[] = [];
  selectedPackages: ReservationPackage[] = [];

  listTypeOfProduct: any[] = [
    {
      name: 'Retraites',
      value: 'retirement'
    },
    {
      name: 'Memberships',
      value: 'membership'
    },
    {
      name: 'Bloc de rédactions',
      value: 'timeslot'
    },
    {
      name: 'Packages',
      value: 'package'
    }
  ];
  selectedTypeOfProduct: any[] = [];

  constructor(private retirementService: RetirementService,
              private couponService: CouponService,
              private authenticationService: AuthenticationService,
              private notificationService: MyNotificationService,
              private membershipService: MembershipService,
              private packageService: ReservationPackageService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.refreshRetirementList();
    this.refreshMembershipList();
    this.refreshPackageList();

    const formUtil = new FormUtil();
    this.couponForm = formUtil.createFormGroup(this.fields);

    this.activatedRoute.params.subscribe((params: Params) => {
      this.couponService.get(params['id']).subscribe(
        data => {
          this.coupon = new Coupon(data);
          this.couponForm.controls['code'].setValue(this.coupon.code);
          this.couponForm.controls['value'].setValue(this.coupon.value);
          this.couponForm.controls['start_time'].setValue(this.coupon.start_time);
          this.couponForm.controls['end_time'].setValue(this.coupon.end_time);
          this.couponForm.controls['max_use'].setValue(this.coupon.max_use);
          this.couponForm.controls['max_use_per_user'].setValue(this.coupon.max_use_per_user);
          this.couponForm.controls['details'].setValue(this.coupon.details);
          this.selectedRetirements = this.setSelectedRetirements();
          this.selectedPackages = this.setSelectedPackages();
          this.selectedTypeOfProduct = this.setSelectedTypeOfProduct();
          this.selectedMemberships = this.setSelectedMemberships();
        }
      );
    });
  }

  refreshRetirementList(search = null) {
    let filters = null;
    if (search) {
      filters = [
        {
          'name': 'name',
          'value': search
        }
      ];
    }
    this.retirementService.list(filters).subscribe(
      retirements => {
        this.listRetirements = retirements.results.map(o => new Retirement(o));
      }
    );
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


  setSelectedRetirements() {
    const selectedRetirements = [];
    for (const retirement of this.coupon.applicable_retirements) {
      selectedRetirements.push(retirement);
    }
    return selectedRetirements;
  }

  getSelectedRetirements() {
    const selectedRetirements = [];
    for (const retirement of this.selectedRetirements) {
      selectedRetirements.push(retirement.url);
    }
    return selectedRetirements;
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
    for (const retirement of this.selectedMemberships) {
      selectedMemberships.push(retirement.url);
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
      value['applicable_retirements'] = this.getSelectedRetirements();
      value['applicable_memberships'] = this.getSelectedMemberships();
      value['applicable_packages'] = this.getSelectedPackages();
      value['applicable_product_types'] = this.getSelectedTypeOfProduct();

      if (this.coupon) {
        this.couponService.update(this.coupon.url, value).subscribe(
          data => {
            this.notificationService.success(
              _('shared.notifications.commons.update.title')
            );
            this.router.navigate(['/admin/coupons']);
          },
          err => {
            if (err.error.non_field_errors) {
              this.couponErrors = err.error.non_field_errors;
            } else {
              this.couponErrors =  ['shared.form.errors.unknown'];
            }
            this.couponForm = FormUtil.manageFormErrors(this.couponForm, err);
          }
        );
      } else {
        this.couponService.create(value).subscribe(
          data => {
            this.notificationService.success(
              _('shared.notifications.commons.added.title')
            );
            this.router.navigate(['/admin/coupons']);
          },
          err => {
            if (err.error.non_field_errors) {
              this.couponErrors = err.error.non_field_errors;
            } else {
              this.couponErrors =  ['shared.form.errors.unknown'];
            }
            this.couponForm = FormUtil.manageFormErrors(this.couponForm, err);
          }
        );
      }
    }
  }

  filterRetirements(search) {
    this.refreshRetirementList(search);
  }
}
