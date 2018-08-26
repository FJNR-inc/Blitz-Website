import { Component, OnInit } from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

import { Subject } from 'rxjs/Subject';
import { CalendarDateFormatter, CalendarEvent, CalendarEventAction, DAYS_OF_WEEK } from 'angular-calendar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WorkplaceService } from '../../../services/workplace.service';
import { Workplace } from '../../../models/workplace';
import { TimeSlotService } from '../../../services/time-slot.service';
import { TimeSlot } from '../../../models/timeSlot';
import { User } from '../../../models/user';
import { AuthenticationService } from '../../../services/authentication.service';
import { Membership } from '../../../models/membership';
import { MembershipService } from '../../../services/membership.service';
import { ReservationPackageService } from '../../../services/reservation-package.service';
import { ReservationPackage } from '../../../models/reservationPackage';
import { MyModalService } from '../../../services/my-modal/my-modal.service';
import { isNull } from 'util';
import { Card } from '../../../models/card';
import { CardService } from '../../../services/card.service';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order';
import { OrderLine } from '../../../models/orderLine';
import {ProfileService} from '../../../services/profile.service';

const colors: any = {
  green: {
    primary: '#33ad21',
    secondary: '#FAE3E3'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  red: {
    primary: '#ad2121',
    secondary: '#FDF1BA'
  },
  reserved: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
};

declare let paysafe: any;

@Component({
  selector: 'app-reservation-page',
  templateUrl: './reservation-page.component.html',
  styleUrls: ['./reservation-page.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CalendarDateFormatter
    }
  ]
})
export class ReservationPageComponent implements OnInit {
  view = 'month';
  viewDate: Date = new Date();
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  locale = 'fr';
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-plus"></i> S\'inscrire',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.eventClicked(event);
      }
    }
  ];

  workplace: Workplace;
  listTimeSlots: TimeSlot[];
  listMembership: Membership[];
  listReservationPackage: ReservationPackage[];
  listCards: Card[];

  selectedTimeSlots: TimeSlot[] = [];
  selectedMembership: Membership = null;
  selectedPackages: ReservationPackage[] = [];
  selectedCard: string = null;
  currentMembership: number;
  currentPackage: number;

  totalTicket = 0;
  totalPrice = 0;
  terms: Boolean = false;

  user: User;

  API_KEY = 'T1QtNjE1NjA6Qi1xYTItMC01ODI0NzQ0YS0wLTMw' +
    'MmQwMjE0NDA2MjUwMDNjMjZjZmUzZmVkYmMxM2UyMmY4YTYwMzBhMW' +
    'JlMDQ4NjAyMTUwMDgyYTYzYzAxNTk5MmRkNWRiYWFhNTIxMTUxNzk3' +
    'NDNjMTY4MDNmNDc=';
  OPTIONS = {
    environment: 'TEST',
    fields: {
      cardNumber: {
        selector: '#card-number',
        placeholder: 'Card number'
      },
      expiryDate: {
        selector: '#expiration-date',
        placeholder: 'Expiration date'
      },
      cvv: {
        selector: '#cvv',
        placeholder: 'CVV'
      }
    }
  };
  private paysafeInstance: any;
  error: string[];

  constructor(private activatedRoute: ActivatedRoute,
              private workplaceService: WorkplaceService,
              private timeSlotService: TimeSlotService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private membershipService: MembershipService,
              private reservationPackageService: ReservationPackageService,
              private myModalService: MyModalService,
              private cardService: CardService,
              private orderService: OrderService,
              private profileService: ProfileService) {}

  ngOnInit() {
    this.initPaysafe();
    this.refreshListTimeSlot();
    this.user = this.authenticationService.getProfile();
    this.refreshListMembership();
    this.refreshListReservationPackage();
    this.refreshListCard();
    this.refreshProfile();
  }

  refreshProfile() {
    this.profileService.get().subscribe(
      profile => {
        this.authenticationService.setProfile(profile);
      }
    );
  }

  refreshListTimeSlot() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.workplaceService.get(params['id']).subscribe(
        data => {
          this.workplace = new Workplace(data);
          const now = new Date().toISOString();
          console.log(now);
          const filters = [
            {
              'name': 'workplace',
              'value': this.workplace.id
            },
            {
              'name': 'start_time__gte',
              'value': now
            }
          ];
          this.timeSlotService.list(filters).subscribe(
            timeSlots => {
              this.listTimeSlots = timeSlots.results.map(l => new TimeSlot(l));
              this.syncCalendarEvent();
            }
          );
        }
      );
    });
  }

  initPaysafe() {
    const instance = this;
    paysafe.fields.setup(this.API_KEY, this.OPTIONS, (paysafeInstance: any, error: any) => {
      if (error) {
        alert(`Setup error: [${error.code}] ${error.detailedMessage}`);
      } else {
        instance.paysafeInstance = paysafeInstance;
      }
    });
  }

  refreshListReservationPackage() {
    const filters: any[] = [
      {
        'name': 'available',
        'value': true
      }
    ];
    if (this.user.membership) {
      filters.push({'name': 'exclusive_memberships', 'value': [this.user.membership.id]});
    } else if (this.selectedMembership) {
      filters.push({'name': 'exclusive_memberships', 'value': [this.selectedMembership.id]});
    } else {
      filters.push({'name': 'exclusive_memberships', 'value': null});
    }
    this.reservationPackageService.list(filters).subscribe(
      reservationPackages => {
        this.listReservationPackage = reservationPackages.results.map(r => new ReservationPackage(r));
        this.currentPackage = this.listReservationPackage[0].id;
      }
    );
  }

  refreshListMembership() {
    const filters: any[] = [
      {
        'name': 'available',
        'value': true
      }
    ];
    if (this.user.academic_level) {
      filters.push({'name': 'academic_levels', 'value': [this.user.academic_level.id]});
    } else {
      filters.push({'name': 'academic_levels', 'value': null});
    }
    this.membershipService.list(filters).subscribe(
      memberships => {
        this.listMembership = memberships.results.map(m => new Membership(m));
      }
    );
  }

  refreshListCard() {
    const filters: any[] = [
      {
        'name': 'owner',
        'value': this.user.id
      }
    ];
    this.cardService.list(filters).subscribe(
      cards => {
        this.listCards = cards.results.map(c => new Card(c));
      }
    );
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event) {
    for (const timeSlot of this.listTimeSlots) {
      if (timeSlot.id === event.id && this.selectedTimeSlots.indexOf(timeSlot) === -1) {
        this.addToCart(timeSlot);
      }
    }
  }

  addToCart(timeSlot) {
    this.selectedTimeSlots.push(timeSlot);
    this.totalTicket += Number(timeSlot.price);
    for (const event of this.events) {
      if (event.id === timeSlot.id) {
        event.color = colors.reserved;
        event.actions = null;
      }
    }
  }

  removeFromCart(timeSlot) {
    const index = this.selectedTimeSlots.indexOf(timeSlot);
    if (index > -1) {
      this.selectedTimeSlots.splice(index, 1);
      this.totalTicket -= Number(timeSlot.price);
      for (const event of this.events) {
        if (event.id === timeSlot.id) {
          event.color = colors.yellow;
          event.actions = this.actions;
        }
      }
    }
  }

  removePackageFromCart(reservationPackage) {
    const index = this.selectedPackages.indexOf(reservationPackage);
    if (index > -1) {
      this.selectedPackages.splice(index, 1);
      this.totalPrice -= Number(reservationPackage.price);
    }
  }

  syncCalendarEvent() {
    this.events = [];
    for (const timeSlot of this.listTimeSlots) {
      this.events.push(this.timeSlotAdapter(timeSlot));
    }
  }

  timeSlotAdapter(timeSlot) {
    return {
      id: timeSlot.id,
      start: new Date(timeSlot.start_time),
      end: new Date(timeSlot.end_time),
      title: timeSlot.getStartTime() + '-' + timeSlot.getEndTime() + ' (' + timeSlot.places_remaining.toString() + ' places restantes)',
      color: colors.yellow,
      actions: this.actions,
    };
  }

  goToLoginPage() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
  }

  ToggleModalAddCard() {
    const name = 'form_credit_card';
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.title = 'Ajouter une carte';
    modal.button2Label = 'Ajouter';
    modal.toggle();
  }

  generateOrder() {
    const instance = this;
    if (!instance.paysafeInstance) {
      console.error('No instance Paysafe');
    } else {
      instance.paysafeInstance.tokenize((paysafeInstance: any, error: any, result: any) => {
        if (error) {
          this.error = ['Ces informations bancaires sont invalides'];
          console.error(`Tokenization error: [${error.code}] ${error.detailedMessage}`);
        } else {
          const newOrder = new Order(
            {
              'single_use_token': result.token,
              'order_lines': [],
            }
          );
          if (this.selectedMembership) {
            newOrder['order_lines'].push(new OrderLine({
                'content_type': 'membership',
                'object_id': this.selectedMembership.id,
                'quantity': 1,
              })
            );
          }
          if (this.selectedPackages) {
            for (const selectedPackage of this.selectedPackages) {
              newOrder['order_lines'].push(new OrderLine({
                  'content_type': 'package',
                  'object_id': selectedPackage.id,
                  'quantity': 1,
                })
              );
            }
          }
          if (this.selectedTimeSlots) {
            for (const selectedTimeslot of this.selectedTimeSlots) {
              newOrder['order_lines'].push(new OrderLine({
                  'content_type': 'timeslot',
                  'object_id': selectedTimeslot.id,
                  'quantity': 1,
                })
              );
            }
          }
          this.orderService.create(newOrder).subscribe(
            response => {
              this.ToggleModalAddCard();
            },
            err => {
              console.log(err);
            }
          );
        }
      });
    }
  }

  needToBuyPackage() {
    if (this.user) {
      if (this.user.membership || this.selectedMembership) {
        let total = this.user.tickets;
        for (const reservationPackage of this.selectedPackages) {
          total += reservationPackage.reservations;
        }
        return total < this.totalTicket;
      }
    }
    return false;
  }

  needToBuyMembership() {
    const userWithoutMembership = this.user && !this.user.membership;
    const noMembershipInCart = isNull(this.selectedMembership);
    return noMembershipInCart && userWithoutMembership;
  }

  needToUseCard() {
    return this.totalPrice > 0;
  }

  canFinalizePayment() {
    return !this.needToBuyPackage() && !this.needToBuyMembership() && this.selectedCard;
  }

  addPackage() {
    for (const reservationPackage of this.listReservationPackage) {
      if (reservationPackage.id.toString() === this.currentPackage.toString()) {
        this.selectedPackages.push(reservationPackage);
        this.totalPrice += Number(reservationPackage.price);
      }
    }
  }

  addMembership() {
    for (const membership of this.listMembership) {
      if (membership.id.toString() === this.currentMembership.toString()) {
        this.selectedMembership = membership;
        this.totalPrice += Number(membership.price);
      }
    }
    this.refreshListReservationPackage();
  }

  removeMembershipFromCart() {
    this.totalPrice -= Number(this.selectedMembership.price);
    this.selectedMembership = null;
  }

  selectCard(event) {
    const value = event.target.value;
    if (value !== 'none') {
      this.selectedCard = value;
    } else {
      this.selectedCard = null;
    }
  }
}
