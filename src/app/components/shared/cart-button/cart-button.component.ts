import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MyCartService} from '../../../services/my-cart/my-cart.service';
import {Cart} from '../../../models/cart';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.scss']
})
export class CartButtonComponent implements OnInit {


  cart$: Observable<Cart>;

  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(private cartService: MyCartService) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit() {
  }

  clicked() {
    this.onClick.emit();
  }
}
