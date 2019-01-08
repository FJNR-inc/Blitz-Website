import { Component, OnInit } from '@angular/core';
import {Order} from '../../../../models/order';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {MembershipService} from '../../../../services/membership.service';
import {Membership} from '../../../../models/membership';
import {FormGroup} from '@angular/forms';
import {FormUtil} from '../../../../utils/form';
import {Cart} from '../../../../models/cart';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';
import {AuthenticationService} from '../../../../services/authentication.service';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';

@Component({
  selector: 'app-retirement-cart',
  templateUrl: './retirement-cart.component.html',
  styleUrls: ['./retirement-cart.component.scss']
})
export class RetirementCartComponent implements OnInit {

  currentStep: number;
  stepOpened: number[] = [];

  memberships: Membership[];
  selectedMembership = null;

  cart: Cart;

  personalInformationForm: FormGroup;
  personalInformationFormIsValid = false;
  personalInformationErrors: string[];
  personalInformationFields = [
    {
      name: 'city',
      type: 'select',
      label: _('Ville de résidence'),
      choices: []
    },
    {
      name: 'phone',
      type: 'text',
      label: _('Téléphone')
    },
    {
      name: 'other',
      type: 'textarea',
      label: _('Restrictions alimentaires ou autres')
    }
  ];


  universityForm: FormGroup;
  universityFormIsValid = false;
  universityErrors: string[];
  universityFields = [
    {
      name: 'coupon_code',
      type: 'text',
      label: _('Code pour accéder à une bourse')
    },
    {
      name: 'matricule',
      type: 'text',
      label: _('Matricule ou code permanent')
    },
    {
      name: 'text-warning',
      type: 'alert',
      label: _('Vous devez répondre aux questions suivantes pour compléter ' +
        'vos informations personnelles et vous inscrire à une ou des retraite(s).')
    },
    {
      name: 'faculty',
      type: 'text',
      label: _('Faculté')
    },
    {
      name: 'program_code',
      type: 'text',
      label: _('Code du programme')
    }
  ];

  constructor(private cartService: MyCartService,
              private membershipService: MembershipService,
              private authenticationService: AuthenticationService,
              private myModalService: MyModalService) {
    this.cart = this.cartService.getCart();
    this.cartService.cart.subscribe(
      emitedCart => {
        this.cart = emitedCart;
        this.defineCurrentStep();
      }
    );
  }

  ngOnInit() {
    this.initPersonalInformationForm();
    this.initUniversityForm();
    this.refreshMembership();
    this.defineCurrentStep();
  }

  getIconForStep(id: number) {
    if ( this.currentStep <= id ) {
      return 'icon icon-times-circle-reverse icon--3x icon--danger';
    } else {
      return 'icon icon-check-circle-reverse icon--3x icon--success';
    }
  }

  defineCurrentStep() {
    if ( !this.authenticationService.isAuthenticated() ) {
      this.currentStep = 1;
    } else if ( !this.haveMembership() ) {
      this.currentStep = 2;
    } else if ( !this.personalInformationFormIsValid ) {
      this.currentStep = 3;
    } else if ( !this.universityFormIsValid ) {
      this.currentStep = 4;
    } else {
      this.currentStep = 5;
    }
  }

  haveMembership() {
    if (this.authenticationService.getProfile().getTimeBeforeEndMembership()) {
      return true;
    } else if (this.cartService.containMembership()) {
      return true;
    } else {
      return false;
    }
  }

  havePaymentMethod() {
    return this.cartService.containPaymentMethod();
  }

  initPersonalInformationForm() {
    const formUtil = new FormUtil();
    this.personalInformationForm = formUtil.createFormGroup(this.personalInformationFields);
  }

  initUniversityForm() {
    const formUtil = new FormUtil();
    this.universityForm = formUtil.createFormGroup(this.universityFields);
  }

  refreshMembership() {
    this.membershipService.list().subscribe(
      data => {
        this.memberships = data.results.map(m => new Membership(m));
      }
    );
  }

  selectMembership() {
    if (this.selectedMembership) {
      for ( const membership of this.memberships ) {
        if (membership.id === Number(this.selectedMembership)) {
          this.cartService.addMembership(membership);
          this.defineCurrentStep();
        }
      }
    }
  }

  submitPersonalInformation() {
    this.personalInformationFormIsValid = true;
    this.defineCurrentStep();
  }

  submitUniversityInformation() {
    this.universityFormIsValid = true;
    this.defineCurrentStep();
  }

  openModalSummaryPayment() {
    this.myModalService.get('summary_payment').toggle();
  }

  toggleStep(stepId: number) {
    const index = this.stepOpened.indexOf(stepId);
    if (index > -1) {
      this.stepOpened.splice(index, 1);
    } else {
      this.stepOpened.push(stepId);
    }
  }

  isAuthenticated() {
    return this.authenticationService.isAuthenticated();
  }
}
