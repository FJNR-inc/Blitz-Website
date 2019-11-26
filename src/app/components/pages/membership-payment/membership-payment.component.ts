import { Component, OnInit } from '@angular/core';
import {Membership} from '../../../models/membership';
import {Order} from '../../../models/order';
import {OrderService} from '../../../services/order.service';
import {OrderLine} from '../../../models/orderLine';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

declare let paysafe: any;

@Component({
  selector: 'app-membership-payment',
  templateUrl: './membership-payment.component.html',
  styleUrls: ['./membership-payment.component.scss']
})
export class MembershipPaymentComponent implements OnInit {

  menuActive = 5;

  API_KEY = environment.token_paysafe;
  OPTIONS = {
    environment: environment.environment_paysafe,
    fields: {
      cardNumber: {
        selector: '#card-number',
        placeholder: ''
      },
      expiryDate: {
        selector: '#expiration-date',
        placeholder: ''
      },
      cvv: {
        selector: '#cvv',
        placeholder: ''
      }
    }
  };
  private paysafeInstance: any;
  error: (string | string[])[];
  buttonDisabled = false;

  membership = null;

  constructor(private orderService: OrderService,
              private router: Router) { }

  ngOnInit() {
    this.initPaysafe();
    this.membership = new Membership(JSON.parse(localStorage.getItem('selectedMembership')));
    if ( !this.membership.id ) {
      this.router.navigate(['/membership/subscription']);
    }
  }

  initPaysafe() {
    const instance = this;
    paysafe.fields.setup(this.API_KEY, this.OPTIONS, (paysafeInstance: any, error: any) => {
      if (error) {
        this.error = [
          _('membership-payment.text_error_1')
        ];
        this.buttonDisabled = true;
      } else {
        instance.paysafeInstance = paysafeInstance;
      }
    });
  }

  generateOrder() {
    this.buttonDisabled = true;
    const instance = this;
    if (!instance.paysafeInstance) {
      this.error = [
        _('membership-payment.text_error_2')
      ];
    } else {
      instance.paysafeInstance.tokenize((paysafeInstance: any, error: any, result: any) => {
        if (error) {
          this.error = [_('membership-payment.text_error_3')];
          this.buttonDisabled = false;
        } else {
          const newOrder = new Order(
            {
              'single_use_token': result.token,
              'order_lines': [],
            }
          );
          newOrder['order_lines'].push(new OrderLine({
              'content_type': 'membership',
              'object_id': this.membership.id,
              'quantity': 1,
            })
          );
          this.orderService.create(newOrder).subscribe(
            response => {
              this.router.navigate(['/membership/done']);
            },
            err => {
              if (err.error.non_field_errors) {
                this.error = [
                  _('membership-payment.text_error_4')
                ];
                this.buttonDisabled = false;
              }
            }
          );
        }
      });
    }
  }

}
