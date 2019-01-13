import { Component, OnInit } from '@angular/core';
import {MyCartService} from '../../../../services/my-cart/my-cart.service';
import {MembershipService} from '../../../../services/membership.service';
import {Membership} from '../../../../models/membership';
import {FormGroup} from '@angular/forms';
import {FormUtil} from '../../../../utils/form';
import {Cart} from '../../../../models/cart';
import {AuthenticationService} from '../../../../services/authentication.service';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {_} from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import {OrderService} from '../../../../services/order.service';
import {MyNotificationService} from '../../../../services/my-notification/my-notification.service';
import {Router} from '@angular/router';
import {UserService} from '../../../../services/user.service';
import {User} from '../../../../models/user';
import {Coupon} from '../../../../models/coupon';

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

  waitAPI = false;
  errorOrder;

  cart: Cart;

  personalInformationForm: FormGroup;
  personalInformationErrors: string[];
  personnalInformationMessageSuccess = [_('retirement-cart.infos.success')];
  personalInformationFields = [
    {
      name: 'city',
      type: 'select',
      label: _('retirement-cart.labels.city'),
      choices: [
        {
          label: 'Chicoutimi',
          value: 'Chicoutimi'
        },
        {
          label: 'Gatineau',
          value: 'Gatineau'
        },
        {
          label: 'Laval',
          value: 'Laval'
        },
        {
          label: 'Longueuil',
          value: 'Longueuil'
        },
        {
          label: 'Montréal',
          value: 'Montreal'
        },
        {
          label: 'Ottawa',
          value: 'Ottawa'
        },
        {
          label: 'Québec',
          value: 'Québec'
        },
        {
          label: 'Rimouski',
          value: 'Rimouski'
        },
        {
          label: 'Rouyn Noranda',
          value: 'Rouyn Noranda'
        },
        {
          label: 'Sherbrooke',
          value: 'Sherbrooke'
        },
        {
          label: 'St-Jérôme',
          value: 'St-Jérôme'
        },
        {
          label: 'Trois-Rivière',
          value: 'Trois-Rivière'
        },
        {
          label: 'Autre',
          value: 'Autre'
        }
      ]
    },
    {
      name: 'phone',
      type: 'text',
      label: _('retirement-cart.labels.phone')
    },
    {
      name: 'personnal_restrictions',
      type: 'textarea',
      label: _('retirement-cart.labels.restrictions')
    }
  ];


  universityForm: FormGroup;
  universityErrors: string[];
  universityFields = [
    {
      name: 'coupon_code',
      type: 'text',
      label: _('retirement-cart.labels.grant_code')
    },
    {
      name: 'text-warning',
      type: 'alert',
      label: _('retirement-cart.labels.personnal_infos')
    },
    {
      name: 'student_number',
      type: 'text',
      label: _('retirement-cart.labels.matricule')
    },
    {
      name: 'faculty',
      type: 'text',
      label: _('retirement-cart.labels.faculty')
    },
    {
      name: 'academic_program_code',
      type: 'text',
      label: _('retirement-cart.labels.program_code')
    }
  ];

  constructor(private cartService: MyCartService,
              private membershipService: MembershipService,
              private authenticationService: AuthenticationService,
              private myModalService: MyModalService,
              private orderService: OrderService,
              private notificationService: MyNotificationService,
              private router: Router,
              private userService: UserService) {
    this.cart = this.cartService.getCart();
    this.cartService.cart.subscribe(
      emitedCart => {
        this.cart = emitedCart;
        this.defineCurrentStep();
      }
    );
    this.authenticationService.profile.subscribe(
      emitedProfile => {
        this.refreshData();
      }
    );
  }

  ngOnInit() {
    this.refreshData();
    this.refreshMembership();
  }

  refreshData() {
    this.initPersonalInformationForm();
    this.initUniversityForm();
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
    } else if ( !this.personalInformationFormIsValid() ) {
      this.currentStep = 3;
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

  personalInformationFormIsValid() {
    const profile = this.authenticationService.getProfile();
    return !!(profile.phone && profile.personnal_restrictions && profile.city);
  }

  havePaymentMethod() {
    return this.cartService.containPaymentMethod();
  }

  initPersonalInformationForm() {
    const formUtil = new FormUtil();
    this.personalInformationForm = formUtil.createFormGroup(this.personalInformationFields);
    const profile = this.authenticationService.getProfile();
    this.personalInformationForm.controls['city'].setValue(profile.city);
    this.personalInformationForm.controls['phone'].setValue(profile.phone);
    this.personalInformationForm.controls['personnal_restrictions'].setValue(profile.personnal_restrictions);
  }

  initUniversityForm() {
    const formUtil = new FormUtil();
    this.universityForm = formUtil.createFormGroup(this.universityFields);
    const profile = this.authenticationService.getProfile();
    this.universityForm.controls['academic_program_code'].setValue(profile.academic_program_code);
    this.universityForm.controls['faculty'].setValue(profile.faculty);
    this.universityForm.controls['student_number'].setValue(profile.student_number);
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
    const value = this.personalInformationForm.value;
    const profile = this.authenticationService.getProfile();
    this.userService.update(profile.url, value).subscribe(
      user => {
        this.authenticationService.setProfile(user);
        this.personnalInformationMessageSuccess = [_('retirement-cart.infos.success_update')];
        this.defineCurrentStep();
      },
      err => {
        if (err.error.non_field_errors) {
          this.personalInformationErrors = err.error.non_field_errors;
        } else {
          this.personalInformationErrors =  ['shared.form.errors.unknown'];
        }
        this.personalInformationForm = FormUtil.manageFormErrors(this.personalInformationForm, err);
      }
    );
  }

  submitUniversityInformation() {
    const value = new User({
      academic_program_code: this.universityForm.controls['academic_program_code'].value,
      faculty: this.universityForm.controls['faculty'].value,
      student_number: this.universityForm.controls['student_number'].value
    });

    const profile = this.authenticationService.getProfile();
    this.userService.update(profile.url, value).subscribe(
      user => {
        this.authenticationService.setProfile(user);
        this.defineCurrentStep();
        this.cartService.addCoupon(
          new Coupon({
              code: this.universityForm.controls['coupon_code'].value
            }
          )
        );
      },
      err => {
        if (err.error.non_field_errors) {
          this.universityErrors = err.error.non_field_errors;
        } else {
          this.universityErrors =  ['shared.form.errors.unknown'];
        }
        this.universityForm = FormUtil.manageFormErrors(this.universityForm, err);
      }
    );
  }

  openModalSummaryPayment() {
    this.errorOrder = null;
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

  submitOrder() {
    const order = this.cart.generateOrder();

    this.orderService.create(order).subscribe(
      response => {
        this.waitAPI = false;
        this.notificationService.success(
          _('shared.notifications.order_done.title'),
          _('shared.notifications.order_done.content')
        );
        this.router.navigate(['/profile']);
      }, err => {
        this.waitAPI = false;
        if (err.error.non_field_errors) {
          this.errorOrder = err.error.non_field_errors;
        } else {
          this.errorOrder = [_('shared.form.errors.unknown')];
        }
      }
    );
  }

  canAddAGrant() {
    return FormUtil.isCompleted(this.universityForm, this.universityFields);
  }
}
