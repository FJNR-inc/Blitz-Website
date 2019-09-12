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

@Component({
  selector: 'app-payment-flow-confirmation',
  templateUrl: './payment-flow-confirmation.component.html',
  styleUrls: ['./payment-flow-confirmation.component.scss']
})
export class PaymentFlowConfirmationComponent implements OnInit {

  cart: Cart;
  cart$: Observable<Cart>;

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
    this.cart$ = this.cartService.cart$;
    this.cart$.subscribe(
      (cart: Cart) => {
        this.cart = cart;
        this.getPaymentInfos();
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
          if (cards.results.length > 0) {
            const card = new Card(cards.results[0].cards[0]);
            this.paymentInfo = '**** **** **** ' + card.last_digits + ' (' + card.card_expiry.month + '/' + card.card_expiry.year + ')';
          } else {
            this.paymentInfo = 'Nouvelle carte ajouté avec succés';
          }
        }
      );
    }
    return null;
  }

  getPaymentInfos() {
    const paymentToken = this.cart.getPaymentToken();
    if (paymentToken) {
      this.getCard(paymentToken);
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
      () => {
        this.cartService.resetCart();
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
