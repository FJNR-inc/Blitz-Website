import {Component, Input, OnInit} from '@angular/core';
import {RetreatType} from '../../../../models/retreatType';

@Component({
  selector: 'app-virtual-activities-item',
  templateUrl: './virtual-activities-item.component.html',
  styleUrls: ['./virtual-activities-item.component.scss']
})
export class VirtualActivitiesItemComponent implements OnInit {

  @Input() retreatType: RetreatType;

  constructor() { }

  ngOnInit() {
  }

}
