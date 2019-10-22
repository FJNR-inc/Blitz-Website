import { Component, OnInit } from '@angular/core';

import {
  isSameDay,
  isSameMonth,
} from 'date-fns';

import {Observable, Subject} from 'rxjs';
import { CalendarDateFormatter, CalendarEvent, DAYS_OF_WEEK } from 'angular-calendar';
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
import {ProfileService} from '../../../services/profile.service';
import {InternationalizationService} from '../../../services/internationalization.service';
import {MyNotificationService} from '../../../services/my-notification/my-notification.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {Cart} from '../../../models/cart';
import {CalendarPeriod} from '../../../models/calendar';

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
  locale = InternationalizationService.getLocale();
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;

  workplace: Workplace;
  listTimeSlots: TimeSlot[];
  listReservedTimeslot: TimeSlot[] = null;
  listMembership: Membership[];
  listCards: Card[];

  selectedTimeSlots: TimeSlot[] = [];
  selectedMembership: Membership = null;
  currentPackage: number;

  totalTicket = 0;

  user: User = null;

  colors = [
    {
      'label': _('reservation-page.colors.lot_of_places_available'),
      'color': {
        primary: '#2A7358',
        secondary: '#2A7358'
      }
    },
    {
      'label': _('reservation-page.colors.less_than_50_percent'),
      'color': {
        primary: '#FFB415',
        secondary: '#FFB415'
      }
    },
    {
      'label': _('reservation-page.colors.almost_no_places_available'),
      'color': {
        primary: '#D95219',
        secondary: '#D95219'
      }
    },
    {
      'label': _('reservation-page.colors.no_places_available'),
      'color': {
        primary: '#E6DCCF',
        secondary: '#E6DCCF'
      }
    }
  ];

  listReservationPackage: ReservationPackage[];
  selectedTimeslot: TimeSlot;
  selectedReservationPackageIndex = 1;
  displayedPanel: 'authentication' | 'product-selector' | 'cart';

  cart: Cart;
  cart$: Observable<Cart>;
  timeSlotsData: CalendarPeriod[] = [];

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
              private profileService: ProfileService,
              private notificationService: MyNotificationService,
              private internationalizationService: InternationalizationService,
              private cartService: MyCartService) {
  }

  ngOnInit() {
    this.cart$ = this.cartService.cart$;
    this.cart$.subscribe(
      (cart: Cart) => this.cart = cart
    );

    this.refreshProfile();
    this.refreshListTimeSlot();
    this.refreshListMembership();
    this.subscribeToLocaleChange();
  }

  subscribeToLocaleChange() {
      this.internationalizationService.locale.subscribe(
        emitedLocale => {
          this.locale = emitedLocale;
        }
      );
  }

  refreshProfile() {
    if (this.authenticationService.isAuthenticated()) {
      this.profileService.get().subscribe(
        profile => {
          this.authenticationService.setProfile(profile);
          this.user = new User(profile);
          this.refreshListReservedTimeSlot();
          this.refreshListCard();
          this.refreshListReservationPackage();
        }
      );
    } else {
      this.refreshListReservedTimeSlot();
      this.refreshListReservationPackage();
    }
  }

  refreshListReservedTimeSlot() {
    if (this.user) {
      this.timeSlotService.list([{'name': 'user', 'value': this.user.id}]).subscribe(
        timeslots => {
          this.listReservedTimeslot = timeslots.results.map(
            t => new TimeSlot(t)
          );
        }
      );
    } else {
      this.listReservedTimeslot = [];
    }
  }

  refreshListTimeSlot() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.workplaceService.get(params['id']).subscribe(
        data => {
          this.workplace = new Workplace(data);
          const now = new Date().toISOString();
          const filters = [
            {
              'name': 'workplace',
              'value': this.workplace.id
            },
            {
              'name': 'end_time__gte',
              'value': now
            }
          ];
          this.timeSlotService.list(filters, 1000, 0, 'start_time').subscribe(
            timeSlots => {
              this.listTimeSlots = timeSlots.results.map(l => new TimeSlot(l));
              this.syncCalendarEvent();
              const newSelectedTimeSlots = [];
              for (const timeslot of this.listTimeSlots) {
                for (const selected of this.selectedTimeSlots) {
                  if (timeslot.id === selected.id) {
                    if (timeslot.places_remaining > 0) {
                      newSelectedTimeSlots.push(timeslot);
                    } else {
                      this.totalTicket -= timeslot.billing_price;
                    }
                  }
                }
              }
              this.selectedTimeSlots = newSelectedTimeSlots;
            }
          );
        }
      );
    });
  }

  refreshListReservationPackage() {
    const filters: any[] = [
      {
        'name': 'available',
        'value': true
      }
    ];

    this.reservationPackageService.list(filters).subscribe(
      reservationPackages => {
        this.listReservationPackage = reservationPackages.results.map(r => new ReservationPackage(r));
        if (this.listReservationPackage.length) {
          this.currentPackage = this.listReservationPackage[0].id;
        }
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
    if (this.user && this.user.academic_level) {
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
    if ( this.user ) {
      const filters: any[] = [
        {
          'name': 'owner',
          'value': this.user.id
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
        if (timeSlot.places_remaining > 0) {
          this.subscribe(timeSlot);
        }
      }
    }
  }

  onEventClicked(event) {
    this.eventClicked(event);
  }

  syncCalendarEvent() {
    this.events = [];
    for (const timeSlot of this.listTimeSlots) {
      this.events.push(this.timeSlotAdapter(timeSlot));
      this.timeSlotsData.push(this.newTimeSlotAdapter(timeSlot));
    }
    this.timeSlotsData = this.timeSlotsData.slice(0);
  }

  getTimeslotColor(timeSlot) {
    if (timeSlot.places_remaining === 0) {
      return this.colors[3].color;
    } else if (timeSlot.places_remaining < Number(this.workplace.seats) / 4) {
      return this.colors[2].color;
    } else if (timeSlot.places_remaining < Number(this.workplace.seats) / 2) {
      return this.colors[1].color;
    } else {
      return this.colors[0].color;
    }
  }

  timeSlotAdapter(timeSlot) {
    return {
      id: timeSlot.id,
      start: new Date(timeSlot.start_time),
      end: new Date(timeSlot.end_time),
      title: timeSlot.getStartTime() + ' à ' + timeSlot.getEndTime() + ' (' + timeSlot.places_remaining.toString() + ' places restantes)',
      color: this.getTimeslotColor(timeSlot)
    };
  }

  newTimeSlotAdapter(timeSlot) {
    return new CalendarPeriod({
      id: timeSlot.id,
      start: new Date(timeSlot.start_time),
      end: new Date(timeSlot.end_time),
      places: timeSlot.workplace.seats,
      places_remaining: timeSlot.places_remaining,
      reservations: timeSlot.reservations,
      users: timeSlot.users
    });
  }

  getNumberOfTicketAvailable() {
    let total = this.cart.getDifferenceOfTicket();
    const user = this.authenticationService.getProfile();

    if (user) {
      total += user.tickets;
    }
    return total;
  }

  firstTimeReservation() {
    if (isNull(this.listReservedTimeslot)) {
      return false;
    } else {
      return this.listReservedTimeslot.length === 0;
    }
  }

  closePanel() {
    this.displayedPanel = null;
  }

  finalize() {
    this.router.navigate(['/payment']);
  }

  addToCart() {
    this.openCart();
  }

  addPackageToCart() {
    this.cartService.addReservationPackage(
      this.listReservationPackage[this.selectedReservationPackageIndex]
    );
    this.myModalService.get('add_package').close();
    this.subscribe(this.selectedTimeslot);
  }

  openCart() {
    this.displayedPanel = 'cart';
  }

  subscribe(timeslot) {
    this.selectedTimeslot = timeslot;
    if (this.authenticationService.isAuthenticated()) {
      if (this.getNumberOfTicketAvailable() > 0) {
        this.displayedPanel = 'product-selector';
      } else {
        this.myModalService.get('add_package').toggle();
      }
    } else {
      this.displayedPanel = 'authentication';
    }
  }
}
