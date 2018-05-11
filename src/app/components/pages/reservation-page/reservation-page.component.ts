import { Component } from '@angular/core';


import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';

import { Subject } from 'rxjs/Subject';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};


@Component({
  selector: 'app-reservation-page',
  templateUrl: './reservation-page.component.html',
  styleUrls: ['./reservation-page.component.scss']
})
export class ReservationPageComponent {
  view = 'month';

  viewDate: Date = new Date();

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-plus"></i> S\'inscrire',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.eventClicked(event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 5),
      end: startOfDay(new Date()),
      title: '09H00 - 12H00 (7 places restantes)',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(startOfDay(new Date()), 5),
      end: startOfDay(new Date()),
      title: '13H00 - 16H00  (3 places restantes)',
      color: colors.yellow,
      actions: this.actions
    },
    {
      start: subDays(startOfDay(new Date()), 5),
      end: startOfDay(new Date()),
      title: '17H00 - 20H00 (15 places restantes)',
      color: colors.yellow,
      actions: this.actions
    },
  ];

  activeDayIsOpen = true;

  constructor() {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventClicked(event) {
    console.log('select this event');
  }
}
