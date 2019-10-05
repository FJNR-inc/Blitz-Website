import BaseModel from './baseModel';

export enum ColorCode {
  many_place = 'many_place',
  less_50_place = 'less_50_place',
  almost_no_place = 'almost_no_place',
  no_place = 'no_place',
  empty_case = 'empty_place',
}

enum PeriodOfDay {
  am = 'am',
  pm = 'pm',
  night = 'night'
}

export class CalandarItem extends BaseModel {

  id?: number;
  position_of_week?: number;
  am_color?: ColorCode;
  pm_color?: ColorCode;
  night_color?: ColorCode;
  activate = true;
  start?: Date;
  end?: Date;
  title?: string;
  color?: any;

  // get every day of the week by current date
  public static startAndEndDaysOfWeek() {
    const current_date = new Date();
    const current_date_str = current_date.getFullYear() + '-' +
    ('0' + (current_date.getMonth() + 1)).slice(-2) + '-' +
    ('0' + current_date.getDate()).slice(-2)
    const now = current_date_str ? new Date(current_date_str) : new Date();
    now.setHours(0, 0, 0, 0);
    this.getPeriod();

    return Array(7).fill('').map((_, i) => {
      const position = i + 1;
      const monday = new Date(now);
      monday.setDate(monday.getDate() - monday.getDay() + (i + 1));
      const day = monday.toDateString().split(' ')[0];
      const month = monday.getMonth() + 1;
      const current_date_int = monday.getDate();
      return {position: position, name_day: day, day_month: month + '/' + current_date_int};
    });
  }

  public static getPeriod() {
    const days_name = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const date = new Date();
    const position_day_week = days_name.indexOf(
      date.toDateString().split(' ')[0]
    );
    const period_day = this.getPeriodDay(date.getHours());

    console.log(date);
    console.log(position_day_week + 1);
    console.log(period_day);
  }

  public static getPeriodDay(hour) {
    if (hour > 0 && hour < 12) {
      return PeriodOfDay.am;
    } else if (hour >= 12 && hour < 18) {
      return PeriodOfDay.pm;
    } else {
      return PeriodOfDay.night;
    }
  }
}
