import { Component, OnInit, Input, DoCheck } from '@angular/core';
import {CalandarItem, ColorCode} from '../../../models/calandarItem';
import {type} from 'os';

@Component({
  selector: 'app-calandar',
  templateUrl: './calandar.component.html',
  styleUrls: ['./calandar.component.scss'],
})
export class CalandarComponent implements OnInit {
  @Input() daysOfWeek: CalandarItem[];
  _timeSlots: CalandarItem[];
  @Input()
  get timeSlots() {
    return this._timeSlots;
  }
  set timeSlots(timeslot) {
    this.days_of_Week_titles = CalandarItem.startAndEndDaysOfWeek();

    console.log('setTimeslot');
    console.log(timeslot);

    // if (this.timeSlots.length > 0) {
    //   for (const timeslot of this.timeSlots) {
    //     // timeslot.getPeriod();
    //   }
    // // }
    //
    if (this.daysOfWeek.length > 0) {
      console.log(this.daysOfWeek);
      for (const day_week of this.daysOfWeek) {
        this.am_array.push(day_week.am_color);
        this.pm_array.push(day_week.pm_color);
        this.night_array.push(day_week.night_color);
      }
    }
  }

  days_of_Week_titles: { name_day: string; position: number; day_month: string }[];
  am_array: string[] = [];
  pm_array: string[] = [];
  night_array: string[] = [];

  constructor() { }

  ngOnInit() {}
}
