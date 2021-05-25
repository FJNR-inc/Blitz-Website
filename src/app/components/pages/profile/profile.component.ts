import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../../models/user';
import {AuthenticationService} from '../../../services/authentication.service';
import {RetreatReservation} from '../../../models/retreatReservation';
import {Observable, Subscription} from 'rxjs';
import {RightPanelService} from '../../../services/right-panel.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  profile: User;
  openVirtualReservation: RetreatReservation;
  displayCartButton$: Observable<boolean> = this._rightPanelService.displayCartButton$;
  finalizeSubscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private _rightPanelService: RightPanelService,
    private router: Router) {

    this.finalizeSubscription = this._rightPanelService.finalize$.subscribe(
      () => {
        this.finalize();
      }
    );
  }

  ngOnInit() {
    this.profile = this.authenticationService.getProfile();

    this.authenticationService.profile.subscribe(
      emitedProfile => this.profile = new User(emitedProfile)
    );
  }

  getTotalPastTomatoes() {
    return this.profile.get_number_of_past_tomatoes;
  }

  getTotalFutureTomatoes() {
    return this.profile.get_number_of_future_tomatoes;
  }

  finalize() {
    this.router.navigate(['/payment']).then();
  }

  openCart() {
    this._rightPanelService.openCartPanel();
  }

  ngOnDestroy(): void {
    this._rightPanelService.closePanel();
    this.finalizeSubscription.unsubscribe();
  }
}
