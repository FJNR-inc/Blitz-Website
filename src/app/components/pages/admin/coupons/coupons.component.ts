import { Component, OnInit } from '@angular/core';
import {Coupon} from '../../../../models/coupon';
import {FormBuilder, FormGroup} from '@angular/forms';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {Router} from '@angular/router';
import {FormUtil} from '../../../../utils/form';
import {isNull} from 'util';
import {CouponService} from '../../../../services/coupon.service';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  listCoupons: Coupon[];

  couponForm: FormGroup;
  couponErrors: string[];
  selectedCouponUrl: string;

  settings = {
    title: _('coupons.coupons'),
    noDataText: _('coupons.no_coupons'),
    addButton: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'code',
        title: _('shared.form.coupon.code')
      },
      {
        name: 'value',
        title: _('shared.form.coupon.value')
      },
      {
        name: 'start_time',
        title: _('shared.form.coupon.start_time')
      },
      {
        name: 'end_time',
        title: _('shared.form.coupon.end_time')
      },
      {
        name: 'details',
        title: _('shared.form.coupon.details')
      }
    ]
  };

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

  constructor(private couponService: CouponService,
              private myModalService: MyModalService,
              private notificationService: MyNotificationService,
              private formBuilder: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.refreshCouponList();

    const formUtil = new FormUtil();
    this.couponForm = formUtil.createFormGroup(this.fields);
  }

  changePage(index: number) {
    this.refreshCouponList(index);
  }

  refreshCouponList(page = 1, limit = 20) {
    this.couponService.list(null, limit, limit * (page - 1)).subscribe(
      coupons => {
        this.settings.numberOfPage = Math.ceil(coupons.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(coupons.previous);
        this.settings.next = !isNull(coupons.next);
        this.listCoupons = coupons.results.map(o => this.couponAdapter(new Coupon(o)));
      }
    );
  }

  OpenModalCreateCoupon() {
    this.couponForm.reset();
    this.selectedCouponUrl = null;
    this.toggleModal(
      'form_coupons',
      _('coupons.create_coupon_modal.title'),
      _('coupons.create_coupon_modal.button')
    );
  }

  toggleModal(name, title: string | string[] = '', button2: string | string[] = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
    modal.toggle();
  }

  submitCoupon() {
    if ( this.couponForm.valid ) {
      const value = this.couponForm.value;
      value['owner'] = this.authenticationService.getProfile().url;
      this.couponService.create(value).subscribe(
        data => {
          this.notificationService.success(
            _('shared.notifications.commons.added.title')
          );
          this.refreshCouponList();
          this.toggleModal('form_coupons');
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

  couponAdapter(coupon) {
    return {
      id: coupon.id,
      url: coupon.url,
      code: coupon.code,
      value: coupon.value,
      start_time: coupon.getStartTime(),
      end_time: coupon.getEndTime(),
      details: coupon.details
    };
  }
}
