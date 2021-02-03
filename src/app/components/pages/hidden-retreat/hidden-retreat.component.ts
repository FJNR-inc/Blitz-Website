import {Component, OnDestroy, OnInit} from '@angular/core';
import {Retreat} from '../../../models/retreat';
import {AuthenticationService} from '../../../services/authentication.service';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RetreatInvitationService} from '../../../services/retreatInvitation.service';
import {RetreatService} from '../../../services/retreat.service';
import {Coupon} from '../../../models/coupon';
import {Subscription} from 'rxjs';
import {RightPanelService} from '../../../services/right-panel.service';

@Component({
  selector: 'app-hidden-retreat',
  templateUrl: './hidden-retreat.component.html',
  styleUrls: ['./hidden-retreat.component.scss']
})
export class HiddenRetreatComponent implements OnInit, OnDestroy {

  retreat: Retreat;
  invitation: any;
  coupon: Coupon;

  displayedPanel: 'authentication' | 'product-selector' | 'cart';

  panelAuthenticateSubscription: Subscription;
  finalizeSubscription: Subscription;

  constructor(private retreatInvitationService: RetreatInvitationService,
              private retreatService: RetreatService,
              private authenticationService: AuthenticationService,
              private cartService: MyCartService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private _rightPanelService: RightPanelService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const token = params['token'];
      this.retreatInvitationService.list([{name: 'url_token', value: token}]).subscribe(
        data => {
          if (data.count > 0) {
            this.invitation = data.results[0];
            this.retreat = new Retreat(this.invitation.retreat_detail);
            if (this.invitation.coupon_detail) {
              this.coupon = new Coupon(this.invitation.coupon_detail);
            } else {
              this.coupon = null;
            }
          } else {
            this.router.navigate(['/404']).then();
          }
        }
      );
    });

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

  closePanel() {
    this.displayedPanel = null;
  }

  ngOnDestroy(): void {
    this._rightPanelService.closePanel();
    this.panelAuthenticateSubscription.unsubscribe();
    this.finalizeSubscription.unsubscribe();
  }


  subscribe() {

    this.cartService.setMetadata(this.retreat, this.generateMetaData());
    this.cartService.addCoupon(this.coupon);
    if (this.authenticationService.isAuthenticated()) {
      this._rightPanelService.openProductSelectorPanel(this.retreat);
    } else {
      this._rightPanelService.openAuthenticationPanel();
    }
  }

  finalize() {
    this.router.navigate(['/payment']).then();
  }

  generateMetaData() {
    return {
      'invitation_id': this.invitation.id
    };
  }

  redirectToRetreatInfo() {
    window.open(
      'https://www.thesez-vous.com/services.html',
      '_blank',
    );
  }
}
