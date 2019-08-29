import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {Cart} from '../../../../models/cart';
import {Card} from '../../../../models/card';
import {CardService} from '../../../../services/card.service';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
  selector: 'app-payment-flow-mode',
  templateUrl: './payment-flow-mode.component.html',
  styleUrls: ['./payment-flow-mode.component.scss']
})
export class PaymentFlowModeComponent implements OnInit {

  _cart: Cart;
  set cart(cart) {
    this._cart = cart;
    this.getPaymentInfos();
  }
  get cart() {
    return this._cart;
  }
  paymentInfo: string;

  @Output() back: EventEmitter<any> = new EventEmitter<any>();
  @Output() forward: EventEmitter<any> = new EventEmitter<any>();

  constructor(private cartService: MyCartService,
              private cardService: CardService,
              private authenticationService: AuthenticationService) {
    this.cart = this.cartService.getCart();
    this.cartService.cart.subscribe(
      emitedCart => {
        this.cart = emitedCart;
      }
    );
  }

  ngOnInit() {
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

  havePaymentMethod() {
    return this.cart.containPaymentMethod();
  }

  getPaymentInfos() {
    const paymentToken = this.cart.getPaymentToken();
    const card = this.getCard(paymentToken);
    if (card) {
      this.paymentInfo = '**** **** **** ' + card.last_digits + ' (' + card.card_expiry + ')';
    } else {
      this.paymentInfo = 'Nouvelle carte ajoute avec succes';
    }
  }

  resetPaymentMode() {
    console.log('remove tokens');
    this.cartService.removePaymentToken();
  }

  goBack() {
    this.back.emit();
  }

  goForward() {
    this.forward.emit();
  }
}
