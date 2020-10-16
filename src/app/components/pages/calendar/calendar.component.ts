import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarDay, CalendarPeriod, ColorCode, PeriodOfDay} from '../../../models/calendar';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [DatePipe],
})
export class CalendarComponent implements OnInit {
  COLOR_CODE_MANY_PLACE = ColorCode.manyPlace;
  COLOR_CODE_LESS_50_PLACE = ColorCode.less50Place;
  COLOR_CODE_ALMOST_NO_PLACE = ColorCode.almostNoPlace;
  COLOR_CODE_NO_PLACE = ColorCode.noPlace;

  CHANGE_WEEK_BACKWARD = 'backward';
  CHANGE_WEEK_FORWARD = 'forward';

  startDateWeek: string;
  endDateWeek: string;

  calendarIsReady = false;

  _timeSlots: CalendarPeriod[] = [];
  @Input()
  get timeSlots() {
    return this._timeSlots;
  }

  set timeSlots(time_slots) {
    if (time_slots.length > 0) {
      this._timeSlots = time_slots;
      this.refreshDaysWeek();
    }
  }

  @Output() periodSelected = new EventEmitter<CalendarPeriod>();

  daysOfWeek: CalendarDay[];

  constructor(
    public datePipe: DatePipe) {
  }

  ngOnInit() {
    this.daysOfWeek = this.getAllDaysOfWeek();
  }

  getLimitsWeek() {
    if (this.daysOfWeek.length < 2) {
      return null;
    }
    return [
      this.datePipe.transform(
        this.daysOfWeek[0].date,
        'dd/MM/yyyy'
      ),
      this.datePipe.transform(
        this.daysOfWeek[6].date,
        'dd/MM/yyyy'
      )
    ];
  }

  refreshDaysWeek() {
    for (const day of this.daysOfWeek) {
      const periods_tmp: CalendarPeriod[] = [null, null, null];
      for (const period of this.timeSlots) {
        const dateweek = this.getDateWithoutHours(day.date);
        const star_date_timeslot = this.getDateWithoutHours(period.start);
        const end_date_timeslot = this.getDateWithoutHours(period.end);

        if ((dateweek >= star_date_timeslot) && (dateweek <= end_date_timeslot)) {
          if (period.period_day) {
            if (period.period_day === PeriodOfDay.am) {
              periods_tmp[0] = period;
            }
            if (period.period_day === PeriodOfDay.pm) {
              periods_tmp[1] = period;
            }
            if (period.period_day === PeriodOfDay.night) {
              periods_tmp[2] = period;
            }
          }
        }
      }
      day.periods = periods_tmp;
      this.calendarIsReady = true;
    }

    const limitsWeek = this.getLimitsWeek();
    if (limitsWeek.length === 2) {
      this.startDateWeek = limitsWeek[0];
      this.endDateWeek = limitsWeek[1];
    }
  }

  getDateWithoutHours(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  changeWeek(direction: string) {
    let currentDate = null;
    if (direction === this.CHANGE_WEEK_FORWARD) {
      currentDate = this.daysOfWeek[6].date;
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (direction === this.CHANGE_WEEK_BACKWARD) {
      currentDate = this.daysOfWeek[0].date;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    this.daysOfWeek = this.getAllDaysOfWeek(currentDate);
    this.refreshDaysWeek();
  }

  // returns every day of the week and their position in the week
  getAllDaysOfWeek(currentDate = new Date()) {
    const currentDateStr = this.datePipe.transform(
      currentDate,
      'yyyy-MM-dd'
    );
    const week = new Array(7);
    for (let i = 0; i < week.length; i++) {
      const position = i + 1;
      const dayOftheWeek = new Date(currentDateStr);
      dayOftheWeek.setDate(dayOftheWeek.getDate() - dayOftheWeek.getDay() + (i + 1));
      week[i] = new CalendarDay({
        date: dayOftheWeek,
        position_of_week: position,
      });
    }

    return week;
  }

  onEventClicked(period: CalendarPeriod) {
    if (period) {
      this.periodSelected.emit(period);
    }
  }

  stylePeriodReserved(period: CalendarPeriod) {
    if (period == null ) {
      return null;
    }
    let css: string = null;
    if (period) {
      css = 'calendar__table__content__col__box';
      if (period.css_style === this.COLOR_CODE_ALMOST_NO_PLACE
        || period.css_style === this.COLOR_CODE_LESS_50_PLACE
        || period.css_style === this.COLOR_CODE_MANY_PLACE ) {
        css += ' calendar__table__content__col__box--pointer';
      }
    }
    if (period.nb_reservations_active > 0 && period.is_reserved) {
      css = 'calendar__table__content__col__box--reserved';
    }

    return css;
  }

  isPeriodDay(period: CalendarPeriod) {
    return period.period_day === 'am' || period.period_day === 'pm' || period.period_day === 'night';
  }
}
