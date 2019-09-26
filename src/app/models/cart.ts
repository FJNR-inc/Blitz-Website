import {Membership} from './membership';
import {Retreat} from './retreat';
import {TimeSlot} from './timeSlot';
import {TaxeUtil} from '../utils/taxe';
import {Order} from './order';
import {OrderLine} from './orderLine';
import {Coupon} from './coupon';
import {AppliedCoupon} from './appliedCoupon';
import {ReservationPackage} from './reservationPackage';
import {OptionProduct} from './optionProduct';
import {User} from './user';

export interface SelectedProductOption {
  option: OptionProduct;
  quantity: number;
}

export interface AppliedProductOption {
  option: OptionProduct;
  quantity: number;
  product_url: string;
}

export interface Metadata {
  json: any;
  product_url: string;
}


export class Cart {
  _memberships: Membership[] = [];
  _retreats: Retreat[] = [];
  _timeslots: TimeSlot[] = [];
  _coupons: Coupon[] = [];
  _reservationPackages: ReservationPackage[] = [];
  _single_use_token: string;
  _payment_token: string;
  _bypassPayment = false;
  _targetUser: User;
  _applied_coupons: AppliedCoupon[] = [];
  _options: AppliedProductOption[] = [];
  _metadata: Metadata[] = [];

  constructor(data: Object = {}) {
    if (data) {
      if (data.hasOwnProperty('_single_use_token')) {
        this._single_use_token = data['_single_use_token'];
      }
      if (data.hasOwnProperty('_payment_token')) {
        this._payment_token = data['_payment_token'];
      }
      if (data.hasOwnProperty('_options')) {
        this._options = data['_options'];
      }
      if (data.hasOwnProperty('_metadata')) {
        this._metadata = data['_metadata'];
      }
      if (data.hasOwnProperty('_memberships')) {
        data['_memberships'].map(
          m => {
            this._memberships.push(new Membership(m));
          }
        );
      }
      if (data.hasOwnProperty('_reservationPackages')) {
        data['_reservationPackages'].map(
          p => {
            this._reservationPackages.push(new ReservationPackage(p));
          }
        );
      }
      if (data.hasOwnProperty('_retreats')) {
        data['_retreats'].map(
          r => {
            this._retreats.push(new Retreat(r));
          }
        );
      }
      if (data.hasOwnProperty('_timeslots')) {
        data['_timeslots'].map(
          t => {
            this._timeslots.push(new TimeSlot(t));
          }
        );
      }
      if (data.hasOwnProperty('_coupons')) {
        data['_coupons'].map(
          t => {
            this._coupons.push(new Coupon(t));
          }
        );
      }
      if (data.hasOwnProperty('_applied_coupons')) {
        data['_applied_coupons'].map(
          t => {
            this._applied_coupons.push(new AppliedCoupon(t));
          }
        );
      }
    }
  }

  get hasOnlyTimeslot(): boolean{
    return this._memberships.length < 1 &&
      this._retreats.length < 1 &&
      this._reservationPackages.length < 1;
  }

  contain(product: Retreat|TimeSlot|Membership) {
    for (const retreat of this.getRetreats()) {
      if (retreat.url === product.url) {
        return true;
      }
    }

    for (const timeslot of this.getTimeslots()) {
      if (timeslot.url === product.url) {
        return true;
      }
    }

    for (const membership of this.getMemberships()) {
      if (membership.url === product.url) {
        return true;
      }
    }

    for (const reservationPackage of this.getReservationPackages()) {
      if (reservationPackage.url === product.url) {
        return true;
      }
    }

    return false;
  }

  getNumberOfProduct() {
    let total = 0;
    total += this.getRetreats().length;
    total += this.getMemberships().length;
    total += this.getReservationPackages().length;
    total += this.getTimeslots().length;

    return total;
  }

  getRetreats() {
    return this._retreats;
  }

  getReservationPackages() {
    return this._reservationPackages;
  }

  getTimeslots() {
    return this._timeslots;
  }

  getMemberships() {
    return this._memberships;
  }

  getCoupons() {
    return this._coupons;
  }

  getAppliedCoupons() {
    return this._applied_coupons;
  }

  setSingleUseToken(token: string) {
    this._single_use_token = token;
    this._payment_token = null;
  }

  setPaymentToken(token: string) {
    this._single_use_token = null;
    this._payment_token = token;
  }

  setBypassPayment(value: boolean) {
    this._bypassPayment = value;
  }

  setTargetUser(user: User) {
    this._targetUser = user;
  }

  getPaymentToken() {
    if (this._single_use_token) {
      return this._single_use_token;
    } else if (this._payment_token) {
      return this._payment_token;
    } else {
      return null;
    }
  }

  removePaymentToken() {
    this._single_use_token = null;
    this._payment_token = null;
  }

  addRetreat(retreat: Retreat, productOptions: SelectedProductOption[] = []) {
    // We can't have multiple time the same retreat in our cart
    if (this.contain(retreat)) {
      this.removeRetreat(retreat.id);
    }
    this._retreats.push(retreat);
    this.addAssignedProductOption(productOptions, retreat);
  }

  addAssignedProductOption(productOptions: SelectedProductOption[], product: Retreat | TimeSlot | ReservationPackage | Membership) {
    for (const selectedOption of productOptions) {
      this._options.push(
        {
          option: selectedOption.option,
          quantity: selectedOption.quantity,
          product_url: product.url,
        }
      );
    }
  }

  removeAssignedProductOption(product: Retreat | TimeSlot | ReservationPackage | Membership) {
    for (const assignedOption of this.getAssignedProductOptions(product)) {
      const index = this._options.indexOf(assignedOption, 0);
      this._options.splice(index, 1);
    }
  }

  getAssignedProductOptions(product: Retreat | TimeSlot | ReservationPackage | Membership) {
    const productAssignedOption: AppliedProductOption[] = [];

    for (const option of this._options) {
      if (option.product_url === product.url) {
        productAssignedOption.push(option);
      }
    }

    return productAssignedOption;
  }

  addReservationPackage(reservationPackage: ReservationPackage, productOptions: SelectedProductOption[] = []) {
    this._reservationPackages.push(reservationPackage);
    this.addAssignedProductOption(productOptions, reservationPackage);
  }

  addTimeslot(timeslot: TimeSlot, productOptions: SelectedProductOption[] = []) {
    // We can't have multiple time the same timeslot in our cart
    if (this.contain(timeslot)) {
      this.removeTimeslot(timeslot.id);
    }
    this._timeslots.push(timeslot);
    this.addAssignedProductOption(productOptions, timeslot);
  }

  setMetadata(product: Retreat | TimeSlot | ReservationPackage | Membership, metadata) {
    let exist = false;
    for (const existingMetadata of this._metadata) {
      if ( existingMetadata.product_url === product.url) {
        existingMetadata.json = metadata;
        exist = true;
      }
    }
    if (!exist) {
      this._metadata.push(
        {
          product_url: product.url,
          json: metadata
        }
      );
    }
  }

  addCoupon(coupon: Coupon) {
    if (coupon.code) {
      // API doesn't support multiple coupon for the moment
      this._coupons = [coupon];
    } else {
      console.error('Coupon may have a code.');
      console.error(coupon);
    }
  }

  setAppliedCoupon(coupon: AppliedCoupon) {
    this._applied_coupons = [coupon];
  }

  removeAppliedCoupon() {
    this._applied_coupons = [];
  }

  addMembership(membership: Membership, productOptions: SelectedProductOption[] = []) {
    // We can order only one membership at a time,
    // otherwise it would make no sense
    if (this._memberships.length > 0) {
      this.removeAssignedProductOption(this._memberships[0]);
    }
    this._memberships = [membership];
    this.addAssignedProductOption(productOptions, membership);
  }

  removeRetreat(retreatId: number) {
    let index = 0;
    for (const retreat of this._retreats) {
      if (retreat.id === retreatId) {
        this._retreats.splice(index, 1);
        this.removeAssignedProductOption(retreat);
        break;
      }
      index += 1;
    }
  }

  removeReservationPackage(reservationPackageId: number) {
    let index = 0;
    for (const reservationPackage of this._reservationPackages) {
      if (reservationPackage.id === reservationPackageId) {
        this._reservationPackages.splice(index, 1);
        this.removeAssignedProductOption(reservationPackage);
        break;
      }
      index += 1;
    }
  }

  removeTimeslot(timeslotId: number) {
    let index = 0;
    for (const timeslot of this._timeslots) {
      if (timeslot.id === timeslotId) {
        this._timeslots.splice(index, 1);
        this.removeAssignedProductOption(timeslot);
        break;
      }
      index += 1;
    }
  }

  removeMembership(membershipId: number) {
    let index = 0;
    for (const membership of this._memberships) {
      if (membership.id === membershipId) {
        this._memberships.splice(index, 1);
        this.removeAssignedProductOption(membership);
        break;
      }
      index += 1;
    }
  }

  removeCoupon() {
    this._coupons = [];
  }

  containPaymentMethod() {
    if (this._single_use_token) {
      return true;
    } else if (this._payment_token) {
      return true;
    } else {
      return false;
    }
  }

  isEmpty() {
    if (this._memberships.length) {
      return false;
    }
    if (this._retreats.length) {
      return false;
    }
    if (this._timeslots.length) {
      return false;
    }
    if (this._reservationPackages.length) {
      return false;
    }
    return true;
  }

  getSubTotal(): string {
    let total = 0;
    for (const membership of this._memberships) {
      total += Number(membership.price);
    }
    for (const retreat of this._retreats) {
      total += Number(retreat.price);
    }
    for (const reservationPackage of this._reservationPackages) {
      total += Number(reservationPackage.price);
    }
    for (const optionProduct of this._options) {
      total += Number(Number(optionProduct.option.price) * Number(optionProduct.quantity));
    }
    for (const appliedCoupon of this._applied_coupons) {
      total -= Number(appliedCoupon.value);
    }
    return total.toFixed(2);
  }

  getDifferenceOfTicket(): number {
    let total = 0;

    for (const reservationPackage of this._reservationPackages) {
      total += Number(reservationPackage.reservations);
    }

    for (const timeslot of this._timeslots) {
      total -= Number(timeslot.billing_price);
    }

    return total;
  }

  getTPS() {
    return TaxeUtil.getTPS(parseFloat(this.getSubTotal()));
  }

  getTVQ() {
    return TaxeUtil.getTVQ(parseFloat(this.getSubTotal()));
  }

  getTotal() {
    const subTotal = parseFloat(this.getSubTotal());
    let total = subTotal;

    total += TaxeUtil.getTPS(subTotal);
    total += TaxeUtil.getTVQ(subTotal);

    return total.toFixed(2);
  }

  needPaymentInformation() {
    return parseFloat(this.getTotal()) > 0 && !this.containPaymentMethod();
  }

  generateOrderline(product: Retreat | TimeSlot | ReservationPackage | Membership,
                    contenttype: 'membership' | 'timeslot' | 'package' | 'retreat' ) {
    const assignedProductOption = this.getAssignedProductOptions(product);
    const orderLine = new OrderLine({
      'content_type': contenttype,
      'object_id': product.id,
      'quantity': 1,
    });
    for (const productOption of assignedProductOption) {
      orderLine.options.push(
        {
          id: productOption.option.id,
          quantity: productOption.quantity
        }
      );
    }
    for (const metadata of this._metadata) {
      if (metadata.product_url === product.url) {
        orderLine.metadata = JSON.stringify(metadata.json);
      }
    }
    return orderLine;
  }

  generateOrder(): Order {
    const newOrder = new Order(
      {
        'order_lines': [],
      }
    );
    if (this._single_use_token) {
      newOrder['single_use_token'] = this._single_use_token;
    } else if (this._payment_token) {
      newOrder['payment_token'] = this._payment_token;
    }
    if (this._targetUser) {
      newOrder['target_user'] = this._targetUser.url;
    }
    if (this._bypassPayment) {
      newOrder['bypass_payment'] = this._bypassPayment;
    }
    if (this._memberships) {
      for (const membership of this._memberships) {
        newOrder['order_lines'].push(
          this.generateOrderline(membership, 'membership')
        );
      }
    }
    if (this._retreats) {
      for (const retreat of this._retreats) {
        newOrder['order_lines'].push(this.generateOrderline(retreat, 'retreat')
        );
      }
    }
    if (this._timeslots) {
      for (const timeslot of this._timeslots) {
        newOrder['order_lines'].push(this.generateOrderline(timeslot, 'timeslot')
        );
      }
    }
    if (this._reservationPackages) {
      for (const reservationPackage of this._reservationPackages) {
        newOrder['order_lines'].push(this.generateOrderline(reservationPackage, 'package')
        );
      }
    }
    if (this._coupons.length > 0) {
      newOrder['coupon'] = this._coupons[0].code;
    }

    return newOrder;
  }
  get hasMembership(): boolean {
    return this.getMemberships().length > 0;
  }
  get hasRetreat(): boolean {
    return this.getRetreats().length > 0;
  }
  get hasTimeslot(): boolean {
    return this.getTimeslots().length > 0;
  }
}
