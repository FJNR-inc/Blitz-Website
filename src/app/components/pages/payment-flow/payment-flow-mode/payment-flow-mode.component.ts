import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {Cart} from '../../../../models/cart';
import {Card} from '../../../../models/card';
import {CardService} from '../../../../services/card.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-payment-flow-mode',
  templateUrl: './payment-flow-mode.component.html',
  styleUrls: ['./payment-flow-mode.component.scss']
})
export class PaymentFlowModeComponent implements OnInit {

  paymentInfo = '';

  @Output() back: EventEmitter<any> = new EventEmitter<any>();
  @Output() forward: EventEmitter<any> = new EventEmitter<any>();

  cart: Cart;
  cart$: Observable<Cart>;

  constructor(private cartService: MyCartService,
              private cardService: CardService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.cart$ = this.cartService.cart$;
    this.cart$.subscribe(
      (cart: Cart) => {
        this.cart = cart;
        this.getPaymentInfos();
      }
    );
  }

  getCard(paymentToken) {
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
          if (cards.results.length > 0) {
            const card = new Card(cards.results[0].cards[0]);
            this.paymentInfo = '**** **** **** ' + card.last_digits + ' (' + card.card_expiry.month + '/' + card.card_expiry.year + ')';
          } else {
            this.paymentInfo = 'Nouvelle carte ajouté avec succés';
          }
        }
      );
    }
  }

  havePaymentMethod() {
    return this.cart.containPaymentMethod();
  }

  getPaymentInfos() {
    const paymentToken = this.cart.getPaymentToken();
    this.getCard(paymentToken);
  }

  resetPaymentMode() {
    this.cartService.removePaymentToken();
  }

  goBack() {
    this.back.emit();
  }

  goForward() {
    this.forward.emit();
  }

  isFree() {
    return parseFloat(this.cart.getTotal()) <= 0;
  }

  canGoForward() {
    return this.havePaymentMethod() || !this.cart.needPaymentInformation();
  }
}
