import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.scss']
})
export class MyTableComponent implements OnInit {

  @Input() settings: any;
  @Input() data: any;

  @Output() selectItem: EventEmitter<any> = new EventEmitter();
  @Output() editItem: EventEmitter<any> = new EventEmitter();
  @Output() removeItem: EventEmitter<any> = new EventEmitter();
  @Output() addButton: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  clickItem(item) {
    this.selectItem.emit(item);
  }

  edit(item) {
    this.editItem.emit(item);
  }

  remove(item) {
    this.removeItem.emit(item);
  }

  add() {
    this.addButton.emit(null);
  }

}
