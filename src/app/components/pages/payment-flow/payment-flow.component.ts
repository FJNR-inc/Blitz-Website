import { Component, OnInit } from '@angular/core';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {Step} from './payment-flow-wizard/payment-flow-wizard.component';
import {Cart} from '../../../models/cart';

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


  steps: Step[];

  saveSteps: Step[] = [
    this.membershipStep,
    this.informationStep,
    this.bourseStep,
    this.paymentModeStep,
    this.confirmationStep,
  ];

  currentStep: Step;

  constructor(private cartService: MyCartService,
              private authenticationService: AuthenticationService) {

  }

  ngOnInit() {

    this.cartService.elementChangeInCart$.subscribe(
      () => {
        this.steps = this.saveSteps;
        this.filterStep();
        this.currentStep = this.steps[0];
      }
    );

  }

  filterStep() {
    if (this.authenticationService.getProfile().hasMembershipActive) {
      this.removeStepMembership();
    } else if (this.cartService.hasMembership) {
      this.removeStepMembership();
    }

    if (!this.cartService.hasRetreat && !this.cartService.hasMembership) {
      this.removeStepBourse();
    }
    if (!this.cartService.hasRetreat) {
      this.removeStepInformation();
    }
  }

  removeStep(step: Step) {
    const indexStep = this.steps.indexOf(step);
    if ( indexStep > -1) {
      this.steps.splice(indexStep, 1);
    }
  }

  removeStepMembership() {
    this.removeStep(this.membershipStep);
  }

  removeStepBourse() {
    this.removeStep(this.bourseStep);
  }

  removeStepInformation() {
    this.removeStep(this.informationStep);
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
