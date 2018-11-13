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

import { Subject } from 'rxjs';
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
import { Order } from '../../../models/order';
import { OrderLine } from '../../../models/orderLine';
import {ProfileService} from '../../../services/profile.service';
import {environment} from '../../../../environments/environment';
import {TaxeUtil} from '../../../utils/taxe';
import {InternationalizationService} from '../../../services/internationalization.service';
import {TranslateService} from '@ngx-translate/core';
import {MyNotificationService} from '../../../services/my-notification/my-notification.service';


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
  locale = InternationalizationService.getLocale();
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;

  workplace: Workplace;
  listTimeSlots: TimeSlot[];
  listReservedTimeslot: TimeSlot[] = null;
  listMembership: Membership[];
  listReservationPackage: ReservationPackage[];
  listCards: Card[];

  selectedTimeSlots: TimeSlot[] = [];
  selectedMembership: Membership = null;
  selectedPackages: ReservationPackage[] = [];
  currentMembership: number;
  currentPackage: number;

  totalTicket = 0;
  totalPrice = 0;

  user: User = null;

  API_KEY = environment.token_paysafe;
  OPTIONS = {
    environment: environment.environment_paysafe,
    fields: {
      cardNumber: {
        selector: '#card-number',
        placeholder: 'Numéro de carte'
      },
      expiryDate: {
        selector: '#expiration-date',
        placeholder: 'Date d\'expiration (Mois/Année)'
      },
      cvv: {
        selector: '#cvv',
        placeholder: 'CVV'
      }
    }
  };
  singleUseToken: string = null;
  paymentToken: string = null;
  private paysafeInstance: any;
  errorModal: string[];
  errorOrder: string[];

  colors = [
    {
      'label': 'Beaucoup de places disponibles',
      'color': {
        primary: '#2A7358',
        secondary: '#2A7358'
      }
    },
    {
      'label': 'Moins de 50% de places disponibles',
      'color': {
        primary: '#FFB415',
        secondary: '#FFB415'
      }
    },
    {
      'label': 'Presque plus de places disponibles',
      'color': {
        primary: '#D95219',
        secondary: '#D95219'
      }
    },
    {
      'label': 'Aucune places disponible',
      'color': {
        primary: '#E6DCCF',
        secondary: '#E6DCCF'
      }
    }
  ];

  labels: string[] = [
    'shared.form.card_number',
    'shared.form.expiration_date',
    'shared.form.CVV',
    'reservation.calendar_legend.many_places_availables',
    'reservation.calendar_legend.half_capacity',
    'reservation.calendar_legend.left_some_places',
    'reservation.calendar_legend.no_more_places',
  ];

  waitPaysafe = false;
  waitAPI = false;
  wantToBuyPackage = false;

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
              private translate: TranslateService) {}

  ngOnInit() {
    this.initPaysafe();
    this.refreshProfile();
    this.refreshListTimeSlot();
    this.refreshListMembership();
    this.subscribeToLocaleChange();
    this.translateStrings();
  }

  translateStrings() {
    this.translate.get(this.labels).subscribe(
      (translatedLabels: string) => {
        this.OPTIONS.fields.cardNumber = translatedLabels['shared.form.card_number'];
        this.OPTIONS.fields.expiryDate = translatedLabels['shared.form.expiration_date'];
        this.OPTIONS.fields.cvv = translatedLabels['shared.form.CVV'];
        this.colors[0].label = translatedLabels['reservation.calendar_legend.many_places_availables'];
        this.colors[1].label = translatedLabels['reservation.calendar_legend.half_capacity'];
        this.colors[2].label = translatedLabels['reservation.calendar_legend.left_some_places'];
        this.colors[3].label = translatedLabels['reservation.calendar_legend.no_more_places'];
      }
    );
  }

  subscribeToLocaleChange() {
      this.internationalizationService.locale.subscribe(
        emitedLocale => {
          this.locale = emitedLocale;
          this.translateStrings();
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
              'name': 'start_time__gte',
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
                      this.totalTicket -= timeslot.price;
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

  initPaysafe() {
    const instance = this;
    paysafe.fields.setup(this.API_KEY, this.OPTIONS, (paysafeInstance: any, error: any) => {
      if (error) {
        console.error(`Setup error: [${error.code}] ${error.detailedMessage}`);
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
    if (this.user && this.user.membership) {
      filters.push({'name': 'exclusive_memberships', 'value': [this.user.membership.id]});
    } else if (this.selectedMembership) {
      filters.push({'name': 'exclusive_memberships', 'value': [this.selectedMembership.id]});
    } else {
      filters.push({'name': 'exclusive_memberships', 'value': null});
    }
    this.reservationPackageService.list(filters).subscribe(
      reservationPackages => {
        this.listReservationPackage = reservationPackages.results.map(r => new ReservationPackage(r));
        if (this.listReservationPackage.length) {
          this.currentPackage = this.listReservationPackage[0].id;
        }
      }
    );
  }

  scroll(element) {
    document.getElementById(element).scrollIntoView({behavior: 'smooth'});
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
          this.addToCart(timeSlot);
        }
      }
    }
  }

  addToCart(timeSlot) {
    if (this.authenticationService.isAuthenticated()) {
      if (this.selectedTimeSlots.length === 0) {
        this.scroll('cart');
      }
      this.selectedTimeSlots.push(timeSlot);
      this.totalTicket += Number(timeSlot.price);
      for (const event of this.events) {
        if (event.id === timeSlot.id) {
          event.color = this.colors[3].color;
        }
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
          event.color = this.getTimeslotColor(timeSlot);
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

  goToLoginPage() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
  }

  ToggleModal(name: string) {
    const modal = this.myModalService.get(name);

    if (!modal) {
      console.error('No modal named %s', name);
      return;
    }

    modal.toggle();
  }

  addCard() {
    const instance = this;
    this.waitPaysafe = true;
    if (!instance.paysafeInstance) {
      console.error('No instance Paysafe');
      this.errorModal = ['Nos services bancaires semblent éprouver quelques difficultés, veuillez recommencer.'];
      this.waitPaysafe = false;
    } else {
      instance.paysafeInstance.tokenize((paysafeInstance: any, error: any, result: any) => {
        if (error) {
          this.errorModal = ['Ces informations bancaires sont invalides'];
          console.error(`Tokenization error: [${error.code}] ${error.detailedMessage}`);
          this.waitPaysafe = false;
        } else {
          this.setSingleUseToken(result.token);
          this.waitPaysafe = false;
          this.ToggleModal('form_credit_card');
        }
      });
    }
  }

  setSingleUseToken(token) {
    this.singleUseToken = token;
    this.paymentToken = null;
  }

  setPaymentToken(token) {
    this.singleUseToken = null;
    this.paymentToken = token;
  }

  finalizeTransaction() {
    if (this.isPaymentButtonDisabled()) {
      this.ToggleModal('payment_button_disabled');
    } else {
      this.generateOrder();
    }
  }
  generateOrder() {
    this.waitAPI = true;
    const newOrder = new Order(
      {
        'order_lines': [],
      }
    );
    if (this.singleUseToken) {
      newOrder['single_use_token'] = this.singleUseToken;
    } else if (this.paymentToken) {
      newOrder['payment_token'] = this.paymentToken;
    }
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
        this.waitAPI = false;
        this.notificationService.success('shared.notifications.order_done.title', 'shared.notifications.order_done.content');
        this.router.navigate(['/profile']);
      }, err => {
        this.waitAPI = false;

        if (err.error.non_field_errors.indexOf('There are no places left in the requested timeslot.') > -1) {
          this.ToggleModal('no_places');
          this.refreshListTimeSlot();
        } else {
          this.errorOrder = ['Impossible de finaliser le paiement. Veuillez réessayer.'];
        }
      }
    );
  }

  getNumberOfTicket() {
    let total = 0;
    for (const reservationPackage of this.selectedPackages) {
      total += reservationPackage.reservations;
    }
    if (this.user != null) {
      total += this.user.tickets;
    }
    return total;
  }

  needToBuyPackage() {
    if (this.user != null) {
      return this.getNumberOfTicket() < this.totalTicket;
    }
    return false;
  }

  showPackageSection() {
    if (this.wantToBuyPackage) {
      return true;
    } else {
      return this.needToBuyPackage();
    }
  }

  needToBuyMembership() {
    const neverHadMembership = this.user && !this.user.membership;
    let expiredMembership = false;
    if (!neverHadMembership && this.user) {
      expiredMembership = new Date(this.user.membership_end) < new Date();
    }
    const noMembershipInCart = isNull(this.selectedMembership);
    return noMembershipInCart && (neverHadMembership || expiredMembership);
  }

  needToUseCard() {
    return this.totalPrice > 0;
  }

  canFinalizePayment() {
    let paymentMethod = false;
    if ( this.singleUseToken || this.paymentToken) {
      paymentMethod = true;
    }
    if (this.needToUseCard() && !paymentMethod) {
      return false;
    }
    if (!this.totalTicket && !this.totalPrice) {
      return false;
    }
    return !this.needToBuyPackage() && !this.needToBuyMembership();
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
      this.setPaymentToken(value);
    } else {
      this.setPaymentToken(null);
    }
  }

  askToBuyPackage() {
    this.wantToBuyPackage = true;
  }

  getLabelFinalizeButton() {
    if (this.totalPrice && this.totalTicket) {
      return 'Payer & Réserver';
    } else if (this.totalPrice) {
      return 'Payer';
    } else if (this.totalTicket) {
      return 'Réserver';
    } else {
      return 'Finaliser';
    }
  }

  isPaymentButtonDisabled() {
    return !this.canFinalizePayment() || this.waitAPI;
  }

  getTotalTPS() {
    return TaxeUtil.getTPS(this.totalPrice);
  }

  getTotalTVQ() {
    return TaxeUtil.getTVQ(this.totalPrice);
  }

  getTotalWithTaxes() {
    return this.totalPrice + this.getTotalTPS() + this.getTotalTVQ();
  }

  needToShowTutorial() {
    if (isNull(this.listReservedTimeslot)) {
      return false;
    } else {
      return this.listReservedTimeslot.length === 0;
    }
  }
}
