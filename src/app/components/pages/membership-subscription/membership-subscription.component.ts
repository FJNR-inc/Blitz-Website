import {Component, OnInit} from '@angular/core';
import {Membership} from '../../../models/membership';
import {MembershipService} from '../../../services/membership.service';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';
import {User} from '../../../models/user';
import {MyCartService} from '../../../services/my-cart/my-cart.service';

@Component({
  selector: 'app-membership-subscription',
  templateUrl: './membership-subscription.component.html',
  styleUrls: ['./membership-subscription.component.scss']
})
export class MembershipSubscriptionComponent implements OnInit {

  menuActive = 3;
  listMemberships: Membership[];
  selectedMembership: Membership = null;
  error: string;
  profile: User = null;

  constructor(private membershipService: MembershipService,
              private router: Router,
              private authenticationService: AuthenticationService,
              private cartService: MyCartService) { }

  ngOnInit() {
    this.profile = this.authenticationService.getProfile();
    this.refreshListMemberships();
  }

  refreshListMemberships() {
    this.membershipService.list([{name: 'available', value: true}]).subscribe(
      memberships => {
        this.listMemberships = memberships.results.map(m => new Membership(m));
      }
    );
  }

  changeMembership(event) {
    for (const membership of this.listMemberships) {
      if (Number(event.target.value) === membership.id) {
        this.selectedMembership = membership;
      }
    }
  }

  submit() {
    if (this.selectedMembership) {
      this.cartService.addMembership(this.selectedMembership);
      this.router.navigate(['/payment']);
    } else {
      this.error = 'Vous devez séléctionnez le membership de votre choix.';
    }
  }

  membershipIsAvailable(membership) {
    let haveRight = false;
    if (this.profile.academic_level) {
      if (membership.academic_levels.indexOf(this.profile.academic_level.url) >= 0) {
        haveRight = true;
      }
    }
    const isForAll = membership.academic_levels.length === 0;
    return haveRight || isForAll;
  }

  get nb_days_with_new_membership(): string{
    return (
      this.profile.getTimeBeforeEndMembership() +
      this.selectedMembership.duration_days
    ).toString();
  }

  get nb_end_date_with_new_membership(): string{
    const today = new Date();
    const membershipEnd = new Date(this.profile.membership_end);
    const newEnd = new Date();

    let newStartDate = today;

    if (this.profile.membership_end && membershipEnd > today) {
      newStartDate = membershipEnd;
    }
    newEnd.setDate(newStartDate.getDate() + this.selectedMembership.duration_days);

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return newEnd.toLocaleDateString('fr-FR', options);
  }
}
