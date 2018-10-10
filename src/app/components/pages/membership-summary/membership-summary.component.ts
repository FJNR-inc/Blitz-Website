import { Component, OnInit } from '@angular/core';
import {Membership} from '../../../models/membership';
import {TaxeUtil} from '../../../utils/taxe';

@Component({
  selector: 'app-membership-summary',
  templateUrl: './membership-summary.component.html',
  styleUrls: ['./membership-summary.component.scss']
})
export class MembershipSummaryComponent implements OnInit {

  menu = [
    {
      'name': 'Informations'
    },
    {
      'name': 'Vérification'
    },
    {
      'name': 'Confirmation'
    },
    {
      'name': 'Abonnement'
    },
    {
      'name': 'Résumé'
    },
    {
      'name': 'Paiement'
    }
  ];

  menuActive = 4;

  membership: Membership = null;

  constructor() { }

  ngOnInit() {
    this.membership = new Membership(JSON.parse(localStorage.getItem('selectedMembership')));
  }

  getTPS() {
    if (this.membership) {
      return TaxeUtil.getTPS(this.membership.price);
    } else {
      return 0;
    }
  }

  getTVQ() {
    if (this.membership) {
      return TaxeUtil.getTVQ(this.membership.price);
    } else {
      return 0;
    }
  }

  getTotal() {
    if (this.membership) {
      return Number(this.membership.price) + Number(this.getTPS()) + Number(this.getTVQ());
    } else {
      return 0;
    }
  }
}
