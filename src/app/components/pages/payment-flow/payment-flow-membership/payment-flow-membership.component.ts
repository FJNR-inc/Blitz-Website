import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MembershipService} from '../../../../services/membership.service';
import {Membership} from '../../../../models/membership';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {AuthenticationService} from '../../../../services/authentication.service';

@Component({
  selector: 'app-payment-flow-membership',
  templateUrl: './payment-flow-membership.component.html',
  styleUrls: ['./payment-flow-membership.component.scss']
})
export class PaymentFlowMembershipComponent implements OnInit {

  memberships: Membership[];
  selectedMembership: Membership = null;

  @Output() forward: EventEmitter<any> = new EventEmitter<any>();

  constructor(private membershipService: MembershipService,
              private cartService: MyCartService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.refreshListMembership();
  }

  refreshListMembership() {
    const user = this.authenticationService.getProfile();
    const filters: any[] = [
      {
        'name': 'available',
        'value': true
      }
    ];
    if (user && user.academic_level) {
      filters.push({'name': 'academic_levels', 'value': [user.academic_level.id]});
    }
    filters.push({'name': 'academic_levels', 'value': null});

    this.membershipService.list(filters).subscribe(
      memberships => {
        this.memberships = memberships.results.map(m => new Membership(m));
      }
    );
  }

  goForward(skipMembership = false) {
    if (!skipMembership && this.selectedMembership) {
      this.cartService.addMembership(this.selectedMembership);
    }
    this.forward.emit();
  }
}
