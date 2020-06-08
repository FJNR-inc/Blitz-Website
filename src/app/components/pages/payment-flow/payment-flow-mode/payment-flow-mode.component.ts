import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {Cart} from '../../../../models/cart';
import {Card} from '../../../../models/card';
import {CardService} from '../../../../services/card.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {Observable} from 'rxjs';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {TranslateService} from '@ngx-translate/core';

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

  new_card: string;
  no_payment_mode: string;

  errorMessageIfFree = _('payment-flow-mode.no_need_to_pay');

  constructor(private cartService: MyCartService,
              private cardService: CardService,
              private authenticationService: AuthenticationService,
              private translate: TranslateService) {
  }

  ngOnInit() {
    this.new_card = this.translate.instant('new_card_added');
    this.no_payment_mode = this.translate.instant('no_payment_mode');
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
    this.paymentInfo = this.new_card;
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
            this.paymentInfo = this.new_card;
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
    if (paymentToken) {
      this.getCard(paymentToken);
    } else {
      this.paymentInfo = this.no_payment_mode;
    }

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
