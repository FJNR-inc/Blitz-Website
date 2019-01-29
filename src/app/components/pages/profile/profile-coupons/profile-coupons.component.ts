import { Component, OnInit } from '@angular/core';
import {CouponService} from '../../../../services/coupon.service';
import {Coupon} from '../../../../models/coupon';
import {AuthenticationService} from '../../../../services/authentication.service';
import {MyModalService} from '../../../../services/my-modal/my-modal.service';
import {send} from 'q';

@Component({
  selector: 'app-profile-coupons',
  templateUrl: './profile-coupons.component.html',
  styleUrls: ['./profile-coupons.component.scss']
})
export class ProfileCouponsComponent implements OnInit {

  coupons: Coupon[] = [];
  selectedCoupon: Coupon;
  errors: string[];
  displayValidationText = false;

  numberOfAddress = [];
  emails = [];

  constructor(private couponService: CouponService,
              private authenticationService: AuthenticationService,
              private modalService: MyModalService) { }

  ngOnInit() {
    const filter = {
      'name': 'owner',
      'value': this.authenticationService.getProfile().id
    };
    this.couponService.list([filter]).subscribe(
      coupons => {
        this.coupons = coupons.results.map(c => new Coupon(c));
      }
    );
  }

  openModal(coupon: Coupon) {
    this.errors = null;
    this.emails = [];
    this.updateNumberOfAddress(3);
    this.selectedCoupon = coupon;
  }

  updateNumberOfAddress(number) {
    this.numberOfAddress = Array(number).fill(0).map((x, i) => i);
    for (let index = 0; index <= number; index++) {
      if (index > this.emails.length) {
        this.emails.push('');
      }
    }

  }

  submit(validation) {
    if (validation === true) {
      this.displayValidationText = false;
      this.sendEmails();
    } else {
      this.displayValidationText = true;
    }
  }

  removeLine(index) {
    this.numberOfAddress.pop();
    this.emails.splice(index, 1);
  }

  toogleDisplayValidationText() {
    this.displayValidationText = !this.displayValidationText;
  }

  getListOfEmail() {
    const sendEmail = [];
    for (const email of this.emails) {
      if (email !== '') {
        sendEmail.push(email);
      }
    }
    return sendEmail;
  }

  sendEmails() {
    this.couponService.notify(this.selectedCoupon, this.getListOfEmail()).subscribe(
      data => {
        this.modalService.get('form_send_coupon').close();
      },
      err => {
        if (err.error.email_list) {
          this.errors = err.error.email_list;
        }
      }
    );
  }
}
