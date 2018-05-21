import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MyModalService } from '../../services/my-modal/my-modal.service';
import { v4 as uuid } from 'uuid';

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

  selectedItem: any;
  uuid: string;
  deleteModalName: string;

  constructor(private myModalService: MyModalService) { }

  ngOnInit() {
    this.uuid = uuid();
    this.deleteModalName = 'delete_table_' + this.uuid;
  }

  clickItem(item) {
    this.selectItem.emit(item);
  }

  edit(item) {
    this.editItem.emit(item);
  }

  confirmRemove(item) {
    this.selectedItem = item;

    const modal = this.myModalService.get(this.deleteModalName);

    if (!modal) {
      console.error('No modal named %s', this.deleteModalName);
      return;
    }

    modal.toggle();
  }

  remove() {
    this.removeItem.emit(this.selectedItem);
    const modal = this.myModalService.get(this.deleteModalName);
    modal.toggle();
  }

  add() {
    this.addButton.emit(null);
  }

}
