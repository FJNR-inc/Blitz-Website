import { Component, OnInit } from '@angular/core';
import {Card} from '../../../models/card';
import {AuthenticationService} from '../../../services/authentication.service';
import {CardService} from '../../../services/card.service';
import {MyCartService} from '../../../services/my-cart/my-cart.service';

@Component({
  selector: 'app-cart-payment',
  templateUrl: './cart-payment.component.html',
  styleUrls: ['./cart-payment.component.scss']
})
export class CartPaymentComponent implements OnInit {

  listCards: Card[];
  paymentCard: string;
  displayFormNewCard = false;

  constructor(private authenticationService: AuthenticationService,
              private cardService: CardService,
              private cartService: MyCartService) { }

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
    this.displayFormNewCard = !this.displayFormNewCard;
    this.paymentCard = null;
    this.cartService.removePaymentToken();
  }

  setCard() {
    this.displayFormNewCard = false;
    this.cartService.addPaymentToken(this.paymentCard);
  }

  setSingleUseToken(token) {
    this.cartService.addPaymentToken(token, true);
  }

  cartContainPaymentMethod() {
    const result =  this.cartService.containPaymentMethod();
    return result;
  }
}
