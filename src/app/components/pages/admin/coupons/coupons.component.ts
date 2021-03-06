import { Component, OnInit } from '@angular/core';
import {Coupon} from '../../../../models/coupon';
import {FormBuilder, FormGroup} from '@angular/forms';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {Router} from '@angular/router';
import {isNull} from 'util';
import {CouponService} from '../../../../services/coupon.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  listCoupons: Coupon[];

  settings = {
    title: _('coupons.coupons'),
    noDataText: _('coupons.no_coupons'),
    addButton: true,
    clickable: true,
    downloadButton: true,
    removeButton: true,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'code',
        title: _('coupons.form.coupon.code')
      },
      {
        name: 'value',
        title: _('coupons.form.coupon.value')
      },
      {
        name: 'start_time',
        title: _('coupons.form.coupon.start_time')
      },
      {
        name: 'end_time',
        title: _('coupons.form.coupon.end_time')
      },
      {
        name: 'details',
        title: _('coupons.form.coupon.details')
      }
    ]
  };

  constructor(private couponService: CouponService,
              private router: Router,
              private notificationService: MyNotificationService) { }

  ngOnInit() {
    this.refreshCouponList();
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

  couponAdapter(coupon) {
    const couponObject = new Coupon(coupon);
    return {
      id: couponObject.id,
      url: couponObject.url,
      code: couponObject.code,
      value: String(couponObject.getValue()) + ' ' + couponObject.getLabelledTypeOfValue(),
      start_time: couponObject.getStartTime(),
      end_time: couponObject.getEndTime(),
      details: couponObject.details
    };
  }

  goToCouponCreationPage() {
    this.router.navigate(['/admin/coupons/create']);
  }

  goToCouponEditionPage(coupon) {
    this.router.navigate(['/admin/coupons/edit/' + coupon.id]);
  }

  exportUsage(coupon) {
    this.couponService.export(coupon.id).subscribe(
      data => {
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    );
  }

  removeCoupon(coupon) {
    this.couponService.remove(coupon).subscribe(
      data => {
        this.notificationService.success(
          _('coupons.notifications.commons.deleted.title')
        );
        this.refreshCouponList();
      },
      err => {
        this.notificationService.error(
          _('coupons.notifications.fail_deletion.title'),
          _('coupons.notifications.fail_deletion.content')
        );
      }
    );
  }
}
