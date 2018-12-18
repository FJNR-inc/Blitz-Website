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

@Component({
  selector: 'app-retirement-cart',
  templateUrl: './retirement-cart.component.html',
  styleUrls: ['./retirement-cart.component.scss']
})
export class RetirementCartComponent implements OnInit {

  currentStep: number;

  memberships: Membership[];
  selectedMembership = null;

  cart: Cart;

  personalInformationForm: FormGroup;
  personalInformationErrors: string[];
  personalInformationFields = [
    {
      name: 'city',
      type: 'select',
      label: 'Ville de résidence',
      choices: []
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Téléphone'
    },
    {
      name: 'other',
      type: 'textarea',
      label: 'Restrictions alimentaires ou autres'
    }
  ];


  universityForm: FormGroup;
  universityErrors: string[];
  universityFields = [
    {
      name: 'coupon_code',
      type: 'text',
      label: 'Code pour accéder à une bourse'
    },
    {
      name: 'matricule',
      type: 'text',
      label: 'Matricule ou code permanent'
    },
    {
      name: 'text-warning',
      type: 'alert',
      label: 'Vous devez répondre aux questions suivantes pour compléter vos ' +
        'informations personnelles et vous inscrire à une ou des retraite(s).'
    },
    {
      name: 'faculty',
      type: 'text',
      label: 'Faculté'
    },
    {
      name: 'program_code',
      type: 'text',
      label: 'Code du programme'
    }
  ];

  constructor(private cartService: MyCartService,
              private membershipService: MembershipService,
              private authenticationService: AuthenticationService) {
    this.cart = this.cartService.getCart();
    this.cartService.cart.subscribe(
      emitedCart => {
        this.cart = emitedCart;
        console.log(this.cart);
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
      return '../../assets/images/icons/icon_exit.svg';
    } else {
      return '../../assets/images/icons/icon_check.svg';
    }
  }

  defineCurrentStep() {
    if ( !this.authenticationService.isAuthenticated() ) {
      this.currentStep = 1;
    } else {
      this.currentStep = 2;
    }
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
          this.currentStep += 1;
        }
      }
    }
  }

  submitPersonalInformation() {
    this.currentStep += 1;
  }

  submitUniversityInformation() {
    this.currentStep += 1;
  }
}
