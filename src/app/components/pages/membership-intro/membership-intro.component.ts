import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-membership-intro',
  templateUrl: './membership-intro.component.html',
  styleUrls: ['./membership-intro.component.scss']
})
export class MembershipIntroComponent implements OnInit {

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

  menuActive = null;

  constructor() { }

  ngOnInit() {
  }

}
