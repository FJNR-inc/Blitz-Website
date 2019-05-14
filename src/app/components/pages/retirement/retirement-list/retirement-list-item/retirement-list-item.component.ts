import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Retirement} from '../../../../../models/retirement';
import {MyCartService} from '../../../../../services/my-cart/my-cart.service';
import {RetirementWaitingQueueService} from '../../../../../services/retirementWaitingQueue.service';
import {RetirementWaitingQueue} from '../../../../../models/retirementWaitingQueue';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {MyNotificationService} from '../../../../../services/my-notification/my-notification.service';
import {AuthenticationService} from '../../../../../services/authentication.service';

@Component({
  selector: 'app-retirement-list-item',
  templateUrl: './retirement-list-item.component.html',
  styleUrls: ['./retirement-list-item.component.scss']
})
export class RetirementListItemComponent implements OnInit {

  @Input() retirement: Retirement;
  @Input() reserved = false;
  @Input() inQueue = false;
  @Input() notified = false;
  @Output() changed: EventEmitter<any> = new EventEmitter();

  showDetails = false;


  constructor(private cartService: MyCartService,
              private retirementWaitingQueueService: RetirementWaitingQueueService,
              private notificationService: MyNotificationService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  toogleDetails() {
    this.showDetails = !this.showDetails;
  }

  // Return true if we can buy the retirement, false if there is no more place available.
  isAvailable() {
    return this.retirement.places_remaining > 0;
  }

  userCanAddToCart() {
    const seatReservedForMe = this.notified && this.retirement.reserved_seats;
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
    this.cartService.addRetirement(this.retirement);
  }

  removeFromCart() {
    this.cartService.removeRetirement(this.retirement.id);
  }

  isInCart() {
    return this.cartService.contain(this.retirement);
  }

  subscribeToWaitingList() {
    const retirementWaitingQueue = new RetirementWaitingQueue(
      {
        retirement: this.retirement.url,
        user: this.authenticationService.getProfile().url
      }
    );
    this.retirementWaitingQueueService.create(retirementWaitingQueue).subscribe(
      data => {
        this.notificationService.success(
          _('retirement-list-item.notifications.subscribe_waiting_list.success.title'),
          _('retirement-list-item.notifications.subscribe_waiting_list.success.content')
        );
        this.changed.emit(true);
      }, err => {
        this.notificationService.success(
          _('retirement-list-item.notifications.subscribe_waiting_list.error.title'),
          _('retirement-list-item.notifications.subscribe_waiting_list.error.content')
        );
        this.changed.emit(true);
      }
    );
  }

  getMessageAlert(){
    if (!this.authenticationService.isAuthenticated() && this.retirement.places_remaining <= 0) {
      return [_('retirement-list-item.messageAlertWaitingList')];
    }
    return [_('retirement-cart.connexion.warning')];
  }
}
