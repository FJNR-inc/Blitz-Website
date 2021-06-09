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

  listCards: Card[];

  new_card: string;
  no_payment_mode: string;

  errorMessageIfFree = _('payment-flow-mode.no_need_to_pay');

  constructor(private cartService: MyCartService,
              private cardService: CardService,
              private authenticationService: AuthenticationService,
              private translate: TranslateService) {
    this.resetPaymentMode();
  }

  ngOnInit() {
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
          } else {
            this.listCards = [];
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

  havePaymentMethod() {
    return this.cart.containPaymentMethod();
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
