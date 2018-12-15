import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Retirement} from '../../../../../models/retirement';
import {MyCartService} from '../../../../../services/my-cart/my-cart.service';
import {DateUtil} from '../../../../../utils/date';

@Component({
  selector: 'app-retirement-list-item',
  templateUrl: './retirement-list-item.component.html',
  styleUrls: ['./retirement-list-item.component.scss']
})
export class RetirementListItemComponent implements OnInit {

  @Input() retirement: Retirement;
  showDetails = false;

  constructor(private cartService: MyCartService) { }

  ngOnInit() {
  }

  toogleDetails() {
    this.showDetails = !this.showDetails;
  }

  // Return true if we can buy the retirement, false if there is no more place available.
  isAvailable() {
    return this.retirement.users.length < this.retirement.seats;
  }

  addToCart(retirement) {
    this.cartService.addRetirement(retirement);
  }
}
