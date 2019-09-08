import { Component, OnInit } from '@angular/core';
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

  listCards: Card[];
  paymentCard: string;

  constructor(private authenticationService: AuthenticationService,
              private cardService: CardService,
              private cartService: MyCartService,
              private modaleService: MyModalService) { }

  ngOnInit() {
    this.refreshListCard();
  }

  refreshListCard() {
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
        }
      );
    }
  }

  toggleFormNewCard() {
    this.toggleModaleNewCard();
    this.paymentCard = null;
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
