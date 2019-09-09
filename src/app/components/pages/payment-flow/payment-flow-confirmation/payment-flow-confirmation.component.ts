import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cart} from '../../../../models/cart';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {Card} from '../../../../models/card';
import {AuthenticationService} from '../../../../services/authentication.service';
import {CardService} from '../../../../services/card.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {OrderService} from '../../../../services/order.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-payment-flow-confirmation',
  templateUrl: './payment-flow-confirmation.component.html',
  styleUrls: ['./payment-flow-confirmation.component.scss']
})
export class PaymentFlowConfirmationComponent implements OnInit {

  _cart: Cart;
  set cart(cart) {
    this._cart = cart;
    this.getPaymentInfos();
  }
  get cart() {
    return this._cart;
  }

  waitAPI = false;
  errorOrder: any[];

  termsAndConditionsAccepted = false;
  paymentInfo: string;


  @Output() back: EventEmitter<any> = new EventEmitter<any>();
  @Output() forward: EventEmitter<any> = new EventEmitter<any>();

  constructor(private cartService: MyCartService,
              private authenticationService: AuthenticationService,
              private cardService: CardService,
              private orderService: OrderService,
              private router: Router) {
    this.cart = this.cartService.getCart();
    this.cartService.cart.subscribe(
      emitedCart => {
        this.cart = emitedCart;
      }
    );
  }

  ngOnInit() {
  }

  changePaymentMethod() {
    this.cartService.removePaymentToken();
    this.goBack();
  }

  getCard(paymentToken): Card {
    const user = this.authenticationService.getProfile();
    if ( user ) {
      const filters: any[] = [
        {
          'name': 'owner',
          'value': user.id
        },
        {
          'name': 'payment_token',
          'value': paymentToken
        }
      ];
      this.cardService.list(filters).subscribe(
        cards => {
          if (cards.results.length >= 1) {
            return new Card(cards.results[0].cards[0]);
          }
        }
      );
    }
    return null;
  }

  getPaymentInfos() {
    const paymentToken = this.cart.getPaymentToken();
    if (paymentToken) {
      const card = this.getCard(paymentToken);
      if (card) {
        this.paymentInfo = '**** **** **** ' + card.last_digits + ' (' + card.card_expiry + ')';
      } else {
        this.paymentInfo = 'Nouvelle carte ajoute avec succes';
      }
    } else {
      this.paymentInfo = 'Aucun mode de paiement';
    }

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
    const order = this.cart.generateOrder();
    this.waitAPI = true;

    this.orderService.create(order).subscribe(
      response => {
        this.router.navigate(['/payment-successful']);
      }, err => {
        this.waitAPI = false;
        this.errorOrder = [];
        if (err.error.non_field_errors) {
          this.errorOrder = err.error.non_field_errors;
        } else {
          this.errorOrder = this.errorOrder.concat([_('shared.form.errors.unknown')]);
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
    this.submitOrder();
  }
}
