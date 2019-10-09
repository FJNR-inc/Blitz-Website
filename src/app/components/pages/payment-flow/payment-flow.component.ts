import { Component, OnInit } from '@angular/core';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {Step} from './payment-flow-wizard/payment-flow-wizard.component';

@Component({
  selector: 'app-payment-flow',
  templateUrl: './payment-flow.component.html',
  styleUrls: ['./payment-flow.component.scss']
})
export class PaymentFlowComponent implements OnInit {

  membershipStep: Step = {
    'label': 'Membership',
    'id': 'membership'
  };

  informationStep: Step = {
    'label': 'Informations',
    'id': 'informations'
  };

  bourseStep: Step = {
    'label': 'Bourses',
    'id': 'bourses'
  };

  paymentModeStep: Step = {
    'label': 'Mode de paiement',
    'id': 'payment_mode'
  };

  confirmationStep: Step = {
    'label': 'Confirmation',
    'id': 'confirmation'
  };


  steps: Step[] = [
    this.membershipStep,
    this.informationStep,
    this.bourseStep,
    this.paymentModeStep,
    this.confirmationStep,
  ];

  currentStep: Step;

  constructor(private cartService: MyCartService,
              private authenticationService: AuthenticationService) {

    if (this.authenticationService.getProfile().hasMembershipActive) {
      this.steps.splice(this.steps.indexOf(this.membershipStep), 1);
    } else if (this.cartService.hasMembership) {
      this.steps.splice(this.steps.indexOf(this.membershipStep), 1);
    }
    this.currentStep = this.steps[0];
  }

  ngOnInit() {
    this.cartService.cart$.subscribe(
      cart => {
        if (cart._retreats.length > 0 && cart._memberships.length > 0) {
          this.steps.splice(this.steps.indexOf(this.bourseStep), 1 );
        }
        if (cart._retreats.length <= 0) {
          this.steps.splice(this.steps.indexOf(this.informationStep), 1);
        }
      }
    );
  }

  goBack() {
    this.currentStep = this.steps[this.steps.indexOf(this.currentStep) - 1];
  }

  goForward() {
    this.currentStep = this.steps[this.steps.indexOf(this.currentStep) + 1];
  }

  isAfterBourseStep() {
    return this.steps.indexOf(this.currentStep) > this.steps.indexOf(this.bourseStep);
  }
  isOnOrAfterBourseStep() {
    return this.steps.indexOf(this.currentStep) >= this.steps.indexOf(this.bourseStep);
  }
}
