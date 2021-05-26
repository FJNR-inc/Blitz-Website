import {Component, OnDestroy, OnInit} from '@angular/core';
import {RetreatTypeService} from '../../../services/retreat-type.service';
import {RetreatType} from '../../../models/retreatType';
import {Observable, Subscription} from 'rxjs';
import {RightPanelService} from '../../../services/right-panel.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-virtual-activities',
  templateUrl: './virtual-activities.component.html',
  styleUrls: ['./virtual-activities.component.scss']
})
export class VirtualActivitiesComponent implements OnInit, OnDestroy {

  retreatTypes: RetreatType[];
  displayCartButton$: Observable<boolean> = this._rightPanelService.displayCartButton$;
  finalizeSubscription: Subscription;

  constructor(
    private retreatTypeService: RetreatTypeService,
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
    const filter = [
      {
        name: 'is_virtual',
        value: 'true',
      }
    ];
    this.retreatTypeService.list(filter).subscribe(
      (retreatTypes) => {
        this.retreatTypes = retreatTypes.results.map(o => new RetreatType(o));
      }
    );
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
