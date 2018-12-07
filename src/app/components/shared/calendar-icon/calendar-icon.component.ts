import {Component, Input, OnInit} from '@angular/core';
import {DateUtil} from '../../../utils/date';

@Component({
  selector: 'app-calendar-icon',
  templateUrl: './calendar-icon.component.html',
  styleUrls: ['./calendar-icon.component.scss']
})
export class CalendarIconComponent implements OnInit {

  @Input() date;

  constructor() { }

  ngOnInit() {
  }

  getYearLabel() {
    return DateUtil.getYear(new Date(this.date));
  }

  getMonthLabel() {
    return DateUtil.getLongMonth(new Date(this.date));
  }

  getDayLabel() {
    return DateUtil.getLongDay(new Date(this.date));
  }

  getDayNumber() {
    return DateUtil.getDate(new Date(this.date));
  }
}
