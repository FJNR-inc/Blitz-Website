import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Retreat} from '../../../../../models/retreat';
import {DateUtil} from '../../../../../utils/date';
import {RetreatType} from "../../../../../models/retreatType";

@Component({
  selector: 'app-retreat-reservation-summary',
  templateUrl: './retreat-reservation-summary.component.html',
  styleUrls: ['./retreat-reservation-summary.component.scss']
})
export class RetreatReservationSummaryComponent implements OnInit {

  @Input() retreats: Retreat[];
  @Input() retreatTypes: RetreatType[];
  @Output() filteredRetreats: EventEmitter<Retreat[]> = new EventEmitter<Retreat[]>();
  summaryList: Retreat[];

  month = new Date().getMonth();
  year = new Date().getFullYear();
  filteredType: string = null;

  constructor() { }

  ngOnInit() {
    this.filterRetreat();
  }

  changeFilteredType(event) {
    this.filteredType = event.target.value;
    this.filterRetreat();
  }

  getPreviousMonth() {
    if (this.month > 0) {
      this.filterRetreat(this.month - 1, this.year);
    } else {
      this.filterRetreat(11, this.year - 1);
    }
  }

  getNextMonth() {
    if (this.month < 11) {
      this.filterRetreat(this.month + 1, this.year);
    } else {
      this.filterRetreat(0, this.year + 1);
    }
  }

  getDate() {
    const date = new Date();
    date.setDate(1);
    date.setMonth(this.month);
    date.setFullYear(this.year);
    return DateUtil.getLongMonth(date) + ' ' + this.year;
  }

  filterRetreat(month = this.month, year = this.year) {
    const newFilteredList = [];
    for (const retreat of this.retreats) {
        if (retreat.getStartDate().getMonth() === month && retreat.getStartDate().getFullYear() === year) {
          if (!this.filteredType || retreat.type.url === this.filteredType) {
            console.log(retreat.type.url + ' - ' + this.filteredType);
            newFilteredList.push(retreat);
          }
        }
    }
    this.filteredRetreats.emit(newFilteredList);
    this.summaryList = newFilteredList;
    this.month = month;
    this.year = year;
  }

  scrollToElement(element) {
    document.getElementById(element).scrollIntoView({behavior: 'smooth'});
  }
}
