import {Component, OnDestroy, OnInit} from '@angular/core';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {RetreatReservation} from '../../../../models/retreatReservation';
import {AuthenticationService} from '../../../../services/authentication.service';
import {RetreatReservationService} from '../../../../services/retreat-reservation.service';
import {Retreat} from '../../../../models/retreat';
import {RetreatWaitingQueueNotification} from '../../../../models/retreatWaitingQueueNotification';
import {RetreatWaitingQueue} from '../../../../models/retreatWaitingQueue';
import {RetreatService} from '../../../../services/retreat.service';
import {RetreatWaitingQueueService} from '../../../../services/retreatWaitingQueue.service';
import {RetreatWaitingQueueNotificationService} from '../../../../services/retreatWaitingQueueNotification.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {RightPanelService} from '../../../../services/right-panel.service';
import {RetreatTypeService} from '../../../../services/retreat-type.service';
import {RetreatType} from '../../../../models/retreatType';

@Component({
  selector: 'app-retreat-reservation',
  templateUrl: './retreat-reservation.component.html',
  styleUrls: ['./retreat-reservation.component.scss']
})
export class RetreatReservationComponent implements OnInit, OnDestroy {

  retreatTypeId: number;
  retreatType: RetreatType;

  retreats: Retreat[];
  displayedRetreats: Retreat[];
  retreatWaitingQueues: RetreatWaitingQueue[];
  retreatWaitingQueueNotifications: RetreatWaitingQueueNotification[];

  retreatReservations: RetreatReservation[];


  selectedRetreat: Retreat;

  displayCartButton$: Observable<boolean> = this._rightPanelService.displayCartButton$;
  panelAuthenticateSubscription: Subscription;
  finalizeSubscription: Subscription;

  constructor(private cartService: MyCartService,
              private authenticationService: AuthenticationService,
              private retreatReservationService: RetreatReservationService,
              private retreatService: RetreatService,
              private retreatWaitingQueueService: RetreatWaitingQueueService,
              private retreatWaitingQueueNotificationService: RetreatWaitingQueueNotificationService,
              private router: Router,
              private _rightPanelService: RightPanelService,
              private activatedRoute: ActivatedRoute,
              private retreatTypeService: RetreatTypeService) {

    this.authenticationService.profile.subscribe(
      () => {
        this.refreshRetreatReservations();
      }
    );

    this.finalizeSubscription = this._rightPanelService.finalize$.subscribe(
      () => {
        this.finalize();
      }
    );

    this.panelAuthenticateSubscription = this._rightPanelService.authenticate$.subscribe(
      () => {
        this.subscribe();
      }
    );
  }

  ngOnDestroy(): void {
    this._rightPanelService.closePanel();
    this.panelAuthenticateSubscription.unsubscribe();
    this.finalizeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.retreatTypeId = params['id'];

        this.retreatTypeService.get(this.retreatTypeId).subscribe(
          (retreatType) => {
            this.retreatType = new RetreatType(retreatType);
          }
        );

        this.refreshContent();
        if (this.authenticationService.isAuthenticated()) {
          this.refreshRetreatReservations();
        }
      }
    );
  }

  refreshRetreatReservations() {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      },
      {
        'name': 'is_active',
        'value': true
      }
    ];
    this.retreatReservationService.list(filters).subscribe(
      data => {
        this.retreatReservations = data.results.map(r => new RetreatReservation(r));
      }
    );
  }

  refreshContent() {
    this.refreshRetreats();
    if (this.authenticationService.isAuthenticated()) {
      this.refreshRetreatWaitingQueue();
      this.refreshRetreatWaitingQueueNotification();
    }
  }

  refreshRetreats() {
    const now = new Date().toISOString();
    const filters = [
      {
        'name': 'is_active',
        'value': true
      },
      {
        'name': 'finish_after',
        'value': now
      },
      {
        'name': 'type',
        'value': this.retreatTypeId,
      },
      {
        'name': 'hidden',
        'value': false
      },
    ];
    this.retreatService.list(filters, 300).subscribe(
      data => {
        this.retreats = [];
        for (const retreat of data.results) {
          const item = new Retreat(retreat);
          if (new Date() < new Date(item.end_time)) {
            this.retreats.push(item);
          }
        }
      }
    );
  }

  refreshRetreatWaitingQueue() {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      }
    ];
    this.retreatWaitingQueueService.list(filters).subscribe(
      data => {
        this.retreatWaitingQueues = data.results.map(r => new RetreatReservation(r));
      }
    );
  }

  refreshRetreatWaitingQueueNotification() {
    const filters = [
      {
        'name': 'user',
        'value': this.authenticationService.getProfile().id
      }
    ];
    this.retreatWaitingQueueNotificationService.list(filters).subscribe(
      data => {
        this.retreatWaitingQueueNotifications = data.results.map(r => new RetreatWaitingQueueNotification(r));
      }
    );
  }

  selectRetreat(retreat) {
    this.selectedRetreat = retreat;
    this.subscribe();
  }

  subscribe() {
    if (this.authenticationService.isAuthenticated()) {
      this._rightPanelService.openProductSelectorPanel(this.selectedRetreat);
    } else {
      this._rightPanelService.openAuthenticationPanel();
    }
  }

  openCart() {
    this._rightPanelService.openCartPanel();
  }

  finalize() {
    this.router.navigate(['/payment']).then();
  }
}
