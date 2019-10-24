import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Retreat} from '../../../../../models/retreat';
import {MyCartService} from '../../../../../services/my-cart/my-cart.service';
import {RetreatWaitingQueueService} from '../../../../../services/retreatWaitingQueue.service';
import {RetreatWaitingQueue} from '../../../../../models/retreatWaitingQueue';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {MyNotificationService} from '../../../../../services/my-notification/my-notification.service';
import {AuthenticationService} from '../../../../../services/authentication.service';
import { MyModalService } from '../../../../../services/my-modal/my-modal.service';
import {Cart} from '../../../../../models/cart';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-retreat-list-item',
  templateUrl: './retreat-list-item.component.html',
  styleUrls: ['./retreat-list-item.component.scss']
})
export class RetreatListItemComponent implements OnInit {

  @Input() retreat: Retreat;
  @Input() reserved = false;
  @Input() inQueue = false;
  @Input() notified = false;
  @Output() changed: EventEmitter<any> = new EventEmitter();

  showDetails = false;
  positionInList = null;
  modalName = null;

  cart: Cart;
  cart$: Observable<Cart>;

  constructor(private cartService: MyCartService,
              private retreatWaitingQueueService: RetreatWaitingQueueService,
              private notificationService: MyNotificationService,
              private authenticationService: AuthenticationService,
              private myModalService: MyModalService, ) {
              }

  ngOnInit() {
    this.cart$ = this.cartService.cart$;
    this.cart$.subscribe(
      (cart: Cart) => this.cart = cart
    );
    this.modalName = 'waiting-list-success-' + String(this.retreat.id);
  }

  toogleDetails() {
    this.showDetails = !this.showDetails;
  }

  // Return true if we can buy the retreat, false if there is no more place available.
  isAvailable() {
    return this.retreat.places_remaining > 0;
  }

  userCanAddToCart() {
    const seatReservedForMe = this.notified && this.retreat.reserved_seats;
    const seatAvailableForNormalPeople = this.isAvailable();
    const seatAvailable = seatAvailableForNormalPeople || seatReservedForMe;
    return this.authenticationService.isAuthenticated() && !this.reserved && seatAvailable && !this.isInCart();
  }

  userCanRemoveFromCart() {
    return this.authenticationService.isAuthenticated() && this.isInCart();
  }

  userCanSubscribeToWaitingList() {
    return this.authenticationService.isAuthenticated() && !this.inQueue && !this.reserved && !this.isAvailable();
  }

  addToCart() {
    this.cartService.addRetreat(this.retreat);
  }

  removeFromCart() {
    this.cartService.removeRetreat(this.retreat.id);
  }

  isInCart() {
    return this.cart.contain(this.retreat);
  }

  subscribeToWaitingList() {
    const retreatWaitingQueue = new RetreatWaitingQueue(
      {
        retreat: this.retreat.url,
        user: this.authenticationService.getProfile().url
      }
    );
    this.retreatWaitingQueueService.create(retreatWaitingQueue).subscribe(
      data => {
        this.positionInList = data.list_size;
        this.toogleModal(
          this.modalName,
          _('retreat-list-item.notifications.subscribe_waiting_list.success.title'),
          _('retreat-list-item.ok')
         );
      }, () => {
        this.notificationService.success(
          _('retreat-list-item.notifications.subscribe_waiting_list.error.title'),
          _('retreat-list-item.notifications.subscribe_waiting_list.error.content')
        );
        this.changed.emit(true);
      }
    );
  }

  refreshPage() {
    this.changed.emit(true);
  }

  toogleModal(name, title: string | string[] = '', button2: string | string[] = '') {
    const modal = this.myModalService.get(name);

    if (!modal) {
      return;
    }

    modal.title = title;
    modal.button2Label = button2;
    modal.toggle();
  }

  getMessageAlert() {
    if (!this.authenticationService.isAuthenticated()) {
      if (this.retreat.places_remaining <= 0) {
        return [_('retreat-list-item.messageAlertWaitingList')];
      }
      return [_('retreat-cart.connexion.warning')];
    }
  }
}
