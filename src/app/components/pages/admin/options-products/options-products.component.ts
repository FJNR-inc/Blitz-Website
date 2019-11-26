import { Component, OnInit } from '@angular/core';
import {isNull} from 'util';
import {Router} from '@angular/router';

import { OptionsProductsService } from '../../../../services/options-products.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import { OptionProduct } from '../../../../models/optionProduct';

@Component({
  selector: 'app-options-products',
  templateUrl: './options-products.component.html',
  styleUrls: ['./options-products.component.scss']
})
export class OptionsProductsComponent implements OnInit {

  listOptionsProducts;

  settings = {
    title: _('options-products.options-products'),
    noDataText: _('options-products.no_options-products'),
    addButton: true,
    clickable: true,
    downloadButton: false,
    removeButton: false,
    previous: false,
    next: false,
    numberOfPage: 0,
    page: 0,
    columns: [
      {
        name: 'name',
        title: _('options-products.form.name')
      },
      {
        name: 'price',
        title: _('options-products.form.price')
      },
      {
        name: 'available',
        title: _('options-products.form.available'),
        type: 'boolean'
      },
      {
        name: 'details',
        title: _('options-products.form.details')
      }
    ]
  };

  constructor(
    private optionsProductsService: OptionsProductsService,
    private notificationService: MyNotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.refreshCouponList();
  }

  changePage(index: number) {
    this.refreshCouponList(index);
  }

  refreshCouponList(page = 1, limit = 20) {
    this.optionsProductsService.list(null, limit, limit * (page - 1)).subscribe(
      data => {
        this.settings.numberOfPage = Math.ceil(data.count / limit);
        this.settings.page = page;
        this.settings.previous = !isNull(data.previous);
        this.settings.next = !isNull(data.next);
        this.listOptionsProducts = data.results.map(o => this.optionProductAdapter(new OptionProduct(o)));
      }
    );
  }

  optionProductAdapter(optionProduct) {
    const optionProductObject = new OptionProduct(optionProduct);
    return {
      id: optionProductObject.id,
      name: optionProductObject.name,
      available: optionProductObject.available,
      details: optionProductObject.details,
      price: '$' + optionProductObject.price
    };
  }

  goToOptionProductCreationPage() {
    this.router.navigate(['/admin/options_products/create']);
  }

  goToCouponEditionPage(coupon) {
    this.router.navigate(['/admin/options_products/edit/' + coupon.id]);
  }
}
