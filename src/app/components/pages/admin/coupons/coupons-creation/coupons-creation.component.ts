import { Component, OnInit } from '@angular/core';
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
import {Router} from '@angular/router';

@Component({
  selector: 'app-coupons-creation',
  templateUrl: './coupons-creation.component.html',
  styleUrls: ['./coupons-creation.component.scss']
})
export class CouponsCreationComponent implements OnInit {

  fields = [
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
              private router: Router) { }

  ngOnInit() {
    this.refreshRetirementList();
    this.refreshMembershipList();
    this.refreshPackageList();

    const formUtil = new FormUtil();
    this.couponForm = formUtil.createFormGroup(this.fields);
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

  getSelectedRetirements() {
    const selectedRetirements = [];
    for (const retirement of this.selectedRetirements) {
      selectedRetirements.push(retirement.url);
    }
    return selectedRetirements;
  }

  getSelectedMemberships() {
    const selectedMemberships = [];
    for (const retirement of this.selectedMemberships) {
      selectedMemberships.push(retirement.url);
    }
    return selectedMemberships;
  }

  getSelectedTypeOfProduct() {
    const selectedTypeOfProduct = [];
    for (const typeOfProduct of this.selectedTypeOfProduct) {
      selectedTypeOfProduct.push(typeOfProduct.value);
    }
    return selectedTypeOfProduct;
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

  filterRetirements(search) {
    this.refreshRetirementList(search);
  }
}
