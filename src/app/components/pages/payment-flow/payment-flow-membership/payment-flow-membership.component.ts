import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MembershipService} from '../../../../services/membership.service';
import {Membership} from '../../../../models/membership';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {AuthenticationService} from '../../../../services/authentication.service';
import {User} from "../../../../models/user";

@Component({
  selector: 'app-payment-flow-membership',
  templateUrl: './payment-flow-membership.component.html',
  styleUrls: ['./payment-flow-membership.component.scss']
})
export class PaymentFlowMembershipComponent implements OnInit {

  memberships: Membership[];
  listMemberships: Membership[];
  profile: User;
  selectedMembership: Membership = null;

  @Output() forward: EventEmitter<any> = new EventEmitter<any>();

  constructor(private membershipService: MembershipService,
              private cartService: MyCartService,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.refreshListMemberships();
  }

  refreshListMemberships() {
    this.membershipService.list([{name: 'available', value: true}]).subscribe(
      memberships => {
        this.listMemberships = memberships.results.map(m => new Membership(m));
        this.filterMemberships()
      }
    );
  }

  filterMemberships() {
    this.profile = this.authenticationService.getProfile()
    this.memberships = [];
    for (const membership of this.listMemberships) {
      let haveRight = false;
      if (this.profile.academic_level) {
        if (membership.academic_levels.indexOf(this.profile.academic_level.url) >= 0) {
          haveRight = true;
        }
      }
      const isForAll = membership.academic_levels.length === 0;

      if (haveRight || isForAll) {
        this.memberships.push(membership);
      }
    }
  }

  goForward(skipMembership = false) {
    if (!skipMembership && this.selectedMembership) {
      this.cartService.addMembership(this.selectedMembership);
    }
    this.forward.emit();
  }
}
