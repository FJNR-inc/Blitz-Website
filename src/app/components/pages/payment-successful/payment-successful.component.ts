import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../services/authentication.service';
import {User} from '../../../models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.component.html',
  styleUrls: ['./payment-successful.component.scss']
})
export class PaymentSuccessfulComponent implements OnInit {

  profile: User;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
    this.profile = this.authenticationService.getProfile();
  }

  ngOnInit() {
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
