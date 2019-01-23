import { Component, OnInit } from '@angular/core';
import {Card} from '../../../../models/card';
import {CardService} from '../../../../services/card.service';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
  selector: 'app-profile-cards',
  templateUrl: './profile-cards.component.html',
  styleUrls: ['./profile-cards.component.scss']
})
export class ProfileCardsComponent implements OnInit {

  listCards: Card[];
  paymentProfile: number;

  constructor(private cardService: CardService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.refreshListCard();
  }

  refreshListCard() {
    this.cardService.list([{'name': 'owner', 'value': this.authenticationService.getProfile().id}]).subscribe(
      cards => {
        if (cards.results.length >= 1) {
          this.paymentProfile = cards.results[0].id;
          this.listCards = cards.results[0].cards.map(c => new Card(c));
        }
      }
    );
  }

  deleteCard(cardId) {
    this.cardService.remove(this.paymentProfile, cardId).subscribe(
      data => {
        this.refreshListCard();
      },
      err => {
        this.refreshListCard();
      }
    );
  }
}
