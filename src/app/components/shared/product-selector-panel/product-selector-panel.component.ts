import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Retreat} from '../../../models/retreat';
import {RetreatReservationService} from '../../../services/retreat-reservation.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {TimeSlot} from '../../../models/timeSlot';
import {ReservationService} from '../../../services/reservation.service';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {SelectedProductOption} from '../../../models/cart';
import {current} from 'codelyzer/util/syntaxKind';

@Component({
  selector: 'app-product-selector-panel',
  templateUrl: './product-selector-panel.component.html',
  styleUrls: ['./product-selector-panel.component.scss']
})
export class ProductSelectorPanelComponent implements OnInit {

  errors: string[];
  selectedProductOptions: SelectedProductOption[] = [];

  @Input() type: 'TimeSlot' | 'Retreat' = 'Retreat';

  _product: Retreat | TimeSlot;
  @Input()
  get product() {
    return this._product;
  }
  set product(product) {
    if ( this.type === 'TimeSlot' ) {
      this.getTimeSlot(product);
    } else if ( this.type === 'Retreat' ) {
      this.getRetreat(product);
    }
  }

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() addToCart: EventEmitter<any> = new EventEmitter();

  constructor(private retreatReservationService: RetreatReservationService,
              private reservationService: ReservationService,
              private authenticationService: AuthenticationService,
              private cartService: MyCartService) { }

  ngOnInit() {
  }

  closePanel() {
    this.close.emit();
  }

  clickedAddToCart() {
    if (this.type === 'TimeSlot') {
      // Create a TimeSlot object to avoid type conflict with addTimeslot()
      const timeslot = new TimeSlot(this.product);
      this.cartService.addTimeslot(timeslot, this.selectedProductOptions);
    } else if (this.type === 'Retreat') {
      // Create a Retreat object to avoid type conflict with addRetreat()
      const retreat = new Retreat(this.product);
      this.cartService.addRetreat(retreat, this.selectedProductOptions);
    }
    this.addToCart.emit();
  }

  private getRetreat(product) {
    const filters = [
      {
        name: 'retreat',
        value: product.id
      },
      {
        name: 'user',
        value: this.authenticationService.getProfile().id
      },
      {
        name: 'is_active',
        value: true
      }
    ];
    this.retreatReservationService.list(filters).subscribe(
      reservations => {
        this._product = product;
        if (reservations.count > 0) {
          this.errors = ['Vous etes deja inscrit a cette retraite'];
        }
      }
    );
  }

  private getTimeSlot(product) {
    const filters = [
      {
        name: 'timeslot',
        value: product.id
      },
      {
        name: 'user',
        value: this.authenticationService.getProfile().id
      },
      {
        name: 'is_active',
        value: true
      }
    ];
    this.reservationService.list(filters).subscribe(
      reservations => {
        this._product = product;
        if (reservations.count > 0) {
          this.errors = ['Vous etes deja inscrit a cette plage horaire'];
        }
      }
    );
  }

  getOptionQuantity(i: number) {
    return new Array(i + 1);
  }

  selectOption(event, currentOption) {
    let exist = false;
    for (const productOption of this.selectedProductOptions) {
      if (productOption.option.id === currentOption.id) {
        productOption.quantity = event.target.value;
        exist = true;
      }
    }
    if (!exist) {
      this.selectedProductOptions.push(
        {
          option: currentOption,
          quantity: event.target.value,
        }
      );
    }
  }
}
