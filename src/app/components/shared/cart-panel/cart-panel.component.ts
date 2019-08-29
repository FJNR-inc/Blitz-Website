import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cart} from '../../../models/cart';

@Component({
  selector: 'app-cart-panel',
  templateUrl: './cart-panel.component.html',
  styleUrls: ['./cart-panel.component.scss']
})
export class CartPanelComponent implements OnInit {

  @Input() cart: Cart;

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() finalize: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closePanel() {
    this.close.emit();
  }

  clickedToFinalize() {
    this.finalize.emit();
  }
}
