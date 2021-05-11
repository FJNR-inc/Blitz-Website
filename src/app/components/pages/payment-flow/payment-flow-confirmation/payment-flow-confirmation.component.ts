import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Cart} from '../../../../models/cart';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {Card} from '../../../../models/card';
import {AuthenticationService} from '../../../../services/authentication.service';
import {CardService} from '../../../../services/card.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {OrderService} from '../../../../services/order.service';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {RetreatType} from '../../../../models/retreatType';
import {RetreatTypeService} from '../../../../services/retreat-type.service';

@Component({
  selector: 'app-payment-flow-confirmation',
  templateUrl: './payment-flow-confirmation.component.html',
  styleUrls: ['./payment-flow-confirmation.component.scss']
})
export class PaymentFlowConfirmationComponent implements OnInit {

  listCards: Card[];

  cart: Cart;
  cart$: Observable<Cart>;

  waitAPI = false;
  errorOrder: any[];

  termsAndConditionsAccepted = false;
  paymentInfo: string;


  @Output() back: EventEmitter<any> = new EventEmitter<any>();
  @Output() forward: EventEmitter<any> = new EventEmitter<any>();

  new_card: string;
  no_payment_mode: string;

  retreatTypes: RetreatType[];

  constructor(private cartService: MyCartService,
              private authenticationService: AuthenticationService,
              private cardService: CardService,
              private orderService: OrderService,
              private router: Router,
              private retreatTypeService: RetreatTypeService,
              private translate: TranslateService) {
    this.new_card = this.translate.instant('new_card_added');
    this.no_payment_mode = this.translate.instant('no_payment_mode');

    const user = this.authenticationService.getProfile();
    if ( user ) {
      const filters: any[] = [
        {
          'name': 'owner',
          'value': user.id
        }
      ];
      this.cardService.list(filters).subscribe(
        cards => {
          if (cards.results.length >= 1) {
            this.listCards = cards.results[0].cards.map(c => new Card(c));
          }
          this.cart$ = this.cartService.cart$;
          this.cart$.subscribe(
            (cart: Cart) => {
              this.cart = cart;
              this.paymentInfo = this.getPaymentInfo();
            }
          );
        }
      );
    }
  }

  ngOnInit() {
    this.refreshRetreatTypeList();
  }

  refreshRetreatTypeList() {
    this.retreatTypeService.list().subscribe(
      (retreatTypes) => {
        this.retreatTypes = retreatTypes.results.map(o => new RetreatType(o));
      }
    );
  }

  changePaymentMethod() {
    this.cartService.removePaymentToken();
    this.goBack();
  }

  goBack() {
    this.back.emit();
  }

  isReadyToFinalize() {
    if (this.cart.needPaymentInformation()) {
      return false;
    } else if (this.cart.isEmpty()) {
      return false;
    } else if (!this.termsAndConditionsAccepted) {
      return false;
    } else {
      return true;
    }
  }

  submitOrder() {
    this.waitAPI = true;
    const order = this.cart.generateOrder();
    this.orderService.create(order).subscribe(
      () => {
        this.cartService.resetCart();
        this.router.navigate(['/payment-successful']);
      }, err => {
        this.waitAPI = false;
        this.errorOrder = [];
        if (err.error.non_field_errors) {
          this.errorOrder = err.error.non_field_errors;
        } else {
          this.errorOrder = this.errorOrder.concat([_('payment-flow-confirmation.form.errors.unknown')]);
          if (err.error.order_lines) {
            for (const orderLine of err.error.order_lines) {
              if (orderLine.object_id) {
                this.errorOrder = this.errorOrder.concat(orderLine.object_id);
              }
            }
          }
        }
      }
    );
  }

  goForward() {
    if (!this.waitAPI) {
      this.submitOrder();
    }
  }

  get confirmButtonText(){
    if (this.cart.hasOnlyTimeslot) {
      return _('payment-flow-confirmation.confirm_button_reservation');
    } else {
      return _('payment-flow-confirmation.confirm_button_paiement');
    }
  }

  retreatTypeIsInCart(type: RetreatType) {
    return this.cartService.containTypeOfRetreat(type);
  }

  get hasTimeslot() {
    return this.cartService.hasTimeslot;
  }

  getPaymentInfo() {
    const paymentToken = this.cart.getPaymentToken();

    try {
      if (paymentToken) {
        for (const card of this.listCards) {
          if (card.payment_token === paymentToken) {
            return '**** **** **** ' + card.last_digits + ' (' + card.card_expiry.month + '/' + card.card_expiry.year + ')';
          }
        }

        return this.new_card;
      } else {
        return this.no_payment_mode;
      }
    } catch {
      return '';
    }
  }
}
