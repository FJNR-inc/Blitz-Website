import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-membership-verification',
  templateUrl: './membership-verification.component.html',
  styleUrls: ['./membership-verification.component.scss']
})
export class MembershipVerificationComponent implements OnInit {

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

  menuActive = 1;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() {
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate(['/membership/subscription']);
    }
  }

}
