import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user';
import { TimeSlotService } from '../../../../services/time-slot.service';
import { TimeSlot } from '../../../../models/timeSlot';
import { Card } from '../../../../models/card';
import { CardService } from '../../../../services/card.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  user: User;

  settings = {
    noDataText: 'Aucune réservation pour le moment',
    clickable: true,
    title: 'Réservations',
    columns: [
      {
        name: 'start_event',
        title: 'Plage horaire'
      }
    ]
  };

  settingsCard = {
    noDataText: 'Aucune carte de paiement pour le moment',
    title: 'Cartes de paiements',
    columns: [
      {
        name: 'number',
        title: 'Numero de carte'
      },
      {
        name: 'expiry_date',
        title: 'Date d\'expiration'
      }
    ]
  };


  listReservations: any[];
  listCards: Card[];

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private timeSlotService: TimeSlotService,
              private router: Router,
              private cardService: CardService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.userService.get(params['id']).subscribe(
        data => {
          this.user = new User(data);
          this.refreshReservation();
          this.refreshListCard();
        }
      );
    });
  }

  refreshReservation() {
    this.timeSlotService.list([{'name': 'user', 'value': this.user.id}]).subscribe(
      timeslots => {
        this.listReservations = timeslots.results.map(
          t => this.reservationAdapter(new TimeSlot(t))
        );
      }
    );
  }

  refreshListCard() {
    this.cardService.list([{'name': 'owner', 'value': this.user.id}]).subscribe(
      cards => {
        this.listCards = cards.results.map(
          c => this.cardAdapter(new Card(c))
        );
      }
    );
  }

  reservationAdapter(reservation) {
    let detail = '';
    detail += reservation.getStartDay();
    detail += ' (';
    detail += reservation.getStartTime();
    detail += ' - ';
    detail += reservation.getEndTime() + ')';

    return {
      id: reservation.id,
      start_event: detail,
    };
  }

  cardAdapter(card: Card) {
    return {
      id: card.id,
      number: '**** **** **** ' + card.last_digits,
      expiry_date: card.card_expiry.month + '/' + card.card_expiry.year,
    };
  }

  goToTimeslot(event) {
    this.router.navigate(['/admin/timeslot/' + event.id]);
  }
}
