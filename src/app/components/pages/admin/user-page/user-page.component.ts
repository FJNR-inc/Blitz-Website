import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../models/user';
import { TimeSlot } from '../../../../models/timeSlot';
import { Card } from '../../../../models/card';
import { CardService } from '../../../../services/card.service';
import {ReservationService} from '../../../../services/reservation.service';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {Workplace} from '../../../../models/workplace';

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
      },
      {
        name: 'workplace_name',
        title: 'Lieu'
      },
      {
        name: 'is_active',
        title: 'Active',
        type: 'boolean'
      },
      {
        name: 'is_present',
        title: 'Present',
        type: 'boolean'
      },
      {
        name: 'cancelation_reason_long',
        title: 'Raison'
      }
    ]
  };

  settingsCard = {
    noDataText: 'Aucune carte de paiement pour le moment',
    title: 'Cartes de paiements',
    columns: [
      {
        name: 'number',
        title: 'Numéro de carte'
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
              private reservationService: ReservationService,
              private router: Router,
              private cardService: CardService,
              private myModalService: MyModalService) { }

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
    this.reservationService.list([{'name': 'user', 'value': this.user.id}]).subscribe(
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
        if (cards.results.length >= 1) {
          this.listCards = cards.results[0].cards.map(
            c => this.cardAdapter(new Card(c))
          );
        } else {
          this.listCards = [];
        }
      }
    );
  }

  reservationAdapter(reservation) {
    const timeslot = new TimeSlot(reservation.timeslot_details);
    const workplace = new Workplace(timeslot.workplace);
    let detail = '';
    detail += timeslot.getStartDay();
    detail += ' (';
    detail += timeslot.getStartTime();
    detail += ' - ';
    detail += timeslot.getEndTime() + ')';

    const reservationAdapted = {
      id: timeslot.id,
      start_event: detail,
      workplace_name: workplace.name,
      is_active: reservation.is_active,
      is_present: reservation.is_present,
      cancelation_reason: reservation.cancelation_reason
    };

    if (reservation.cancelation_reason === 'TM') {
      reservationAdapted['cancelation_reason_long'] = 'Plage horaire modifié';
    } else if (reservation.cancelation_reason === 'U') {
      reservationAdapted['cancelation_reason_long'] = 'Annulé par l\'utilisateur';
    } else if (reservation.cancelation_reason === 'TD') {
      reservationAdapted['cancelation_reason_long'] = 'Plage horaire supprimé';
    } else {
      reservationAdapted['cancelation_reason_long'] = '-';
    }

    return reservationAdapted;
  }

  cardAdapter(card: Card) {
    return {
      id: card.id,
      number: '**** **** **** ' + card.last_digits,
      expiry_date: card.card_expiry.month + '/' + card.card_expiry.year,
    };
  }

  goToTimeslot(event) {
    if (event.cancelation_reason !== 'TD') {
      this.router.navigate(['/admin/timeslot/' + event.id]);
    } else {
      this.toggleModal('timeslot_deleted');
    }
  }

  toggleModal(name) {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.toggle();
  }
}
