import { Component, OnInit } from '@angular/core';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {Step} from './payment-flow-wizard/payment-flow-wizard.component';
import {Cart} from '../../../models/cart';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {RetreatType} from '../../../models/retreatType';
import {RetreatTypeService} from '../../../services/retreat-type.service';

@Component({
  selector: 'app-payment-flow',
  templateUrl: './payment-flow.component.html',
  styleUrls: ['./payment-flow.component.scss']
})
export class PaymentFlowComponent implements OnInit {

  membershipStep: Step = {
    'label': _('payment-flow.steps.membership'),
    'id': 'membership'
  };

  informationStep: Step = {
    'label': _('payment-flow.steps.informations'),
    'id': 'informations'
  };

  bourseStep: Step = {
    'label': _('payment-flow.steps.grant'),
    'id': 'bourses'
  };

  paymentModeStep: Step = {
    'label': _('payment-flow.steps.payment_mode'),
    'id': 'payment_mode'
  };

  confirmationStep: Step = {
    'label': _('payment-flow.steps.confirmation'),
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

  retreatTypes: RetreatType[];

  constructor(private cartService: MyCartService,
              private authenticationService: AuthenticationService,
              private retreatTypeService: RetreatTypeService) {

  }

  ngOnInit() {
    this.cartService.elementChangeInCart$.subscribe(
      () => {
        this.steps = this.saveSteps;
        this.filterStep();
        this.currentStep = this.steps[0];
      }
    );

    this.refreshRetreatTypeList();
  }

  refreshRetreatTypeList() {
    this.retreatTypeService.list().subscribe(
      (retreatTypes) => {
        this.retreatTypes = retreatTypes.results.map(o => new RetreatType(o));
      }
    );
  }

  filterStep() {
    if (this.authenticationService.getProfile().hasMembershipActive) {
      this.removeStepMembership();
    } else if (this.cartService.hasMembership) {
      this.removeStepMembership();
    }

    if (!this.cartService.hasRetreat && !this.cartService.hasMembership && !this.cartService.hasReservationPackages) {
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

  retreatTypeIsInCart(type: RetreatType) {
    return this.cartService.containTypeOfRetreat(type);
  }

  get hasTimeslot() {
    return this.cartService.hasTimeslot;
  }
}
