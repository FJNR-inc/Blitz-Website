import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Retreat} from '../../../../../models/retreat';
import {DateUtil} from '../../../../../utils/date';
import {environment} from '../../../../../../environments/environment';
import {RetreatType} from '../../../../../models/retreatType';
import {RetreatTypeService} from '../../../../../services/retreat-type.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-retreat-reservation-summary',
  templateUrl: './retreat-reservation-summary.component.html',
  styleUrls: ['./retreat-reservation-summary.component.scss']
})
export class RetreatReservationSummaryComponent implements OnInit {

  @Input() retreatTypeId: number;

  _retreats;
  get retreats() {
    return this._retreats;
  }
  @Input() set retreats(value: Retreat[]) {
     this._retreats = value;
     this.initContent();
  }
  @Output() filteredRetreats: EventEmitter<Retreat[]> = new EventEmitter<Retreat[]>();
  summaryList: Retreat[];

  month = new Date().getMonth();
  year = new Date().getFullYear();
  retreatTypes: RetreatType[];

  constructor(private retreatTypeService: RetreatTypeService,
              private router: Router) { }

  get isDefaultRetreatType() {
    return environment.defaultRetreatId.toString() === this.retreatTypeId.toString();
  }

  ngOnInit() {
    this.initContent();
  }

  initContent() {
    this.filterRetreat();
    this.refreshRetreatType();
  }

  changeFilteredType(event) {
    this.router.navigate(['/retreats/' + event.target.value]);
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
      if (retreat.getDisplayStartDate()) {
        if (retreat.getDisplayStartDate().getMonth() === month && retreat.getDisplayStartDate().getFullYear() === year) {
          newFilteredList.push(retreat);
        }
      } else {
        if (retreat.getStartDate().getMonth() === month && retreat.getStartDate().getFullYear() === year) {
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

  refreshRetreatType() {
    const filter = [
      {
        name: 'is_virtual',
        value: 'true',
      }
    ];
    this.retreatTypeService.list(filter).subscribe(
      (retreatTypes) => {
        this.retreatTypes = retreatTypes.results.map(o => new RetreatType(o));
      }
    );
  }
}
