import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from '../../../models/card';
import {AuthenticationService} from '../../../services/authentication.service';
import {CardService} from '../../../services/card.service';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {MyModalService} from '../../../services/my-modal/my-modal.service';

@Component({
  selector: 'app-cart-payment',
  templateUrl: './cart-payment.component.html',
  styleUrls: ['./cart-payment.component.scss']
})
export class CartPaymentComponent implements OnInit {

  @Input() listCards: Card[];
  paymentCard = '';

  constructor(private authenticationService: AuthenticationService,
              private cardService: CardService,
              private cartService: MyCartService,
              private modaleService: MyModalService) { }

  ngOnInit() {}

  toggleFormNewCard() {
    this.toggleModaleNewCard();
    this.paymentCard = '';
    this.cartService.removePaymentToken();
  }

  setCard() {
    this.closeModaleNewCard();
    this.cartService.addPaymentToken(this.paymentCard);
  }

  setSingleUseToken(token) {
    this.closeModaleNewCard();
    this.cartService.addPaymentToken(token, true);
  }

  toggleModaleNewCard() {
    this.modaleService.get('new-card').toggle();
  }

  closeModaleNewCard() {
    this.modaleService.get('new-card').close();
  }
}
