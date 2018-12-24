import {InternationalizationService} from '../services/internationalization.service';

export class DateUtil {

  static formatDayAndTime(date) {
    return this.formatDay(date) + ' - ' + this.formatTime(date);
  }

  static formatDay(date) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const locale = InternationalizationService.getLocale();
    console.log(locale);
    return date.toLocaleDateString(locale, options);
  }

  static formatTime(date) {
    const options = {
      hour: '2-digit',
      minute: '2-digit'
    };
    const locale = InternationalizationService.getLocale();
    return date.toLocaleString(locale, options).replace(/ /g, '');
  }

  static getLongDay(date) {
    const index = date.getDay();

    if (index === 0) {
      return 'Dimanche';
    } else if (index === 1) {
      return 'Lundi';
    } else if (index === 2) {
      return 'Mardi';
    } else if (index === 3) {
      return 'Mercredi';
    } else if (index === 4) {
      return 'Jeudi';
    } else if (index === 5) {
      return 'Vendredi';
    } else if (index === 6) {
      return 'Samedi';
    }
  }

  static getLongMonth(date) {
    const index = date.getMonth();

    if (index === 0) {
      return 'Janvier';
    } else if (index === 1) {
      return 'Février';
    } else if (index === 2) {
      return 'Mars';
    } else if (index === 3) {
      return 'Avril';
    } else if (index === 4) {
      return 'Mai';
    } else if (index === 5) {
      return 'Juin';
    } else if (index === 6) {
      return 'Juillet';
    } else if (index === 7) {
      return 'Aout';
    } else if (index === 8) {
      return 'Septembre';
    } else if (index === 9) {
      return 'Octobre';
    } else if (index === 10) {
      return 'Novembre';
    } else if (index === 11) {
      return 'Décembre';
    }
  }

  static getDate(date) {
    return date.getDate();
  }

  static getYear(date) {
    return date.getFullYear();
  }

  static getDateInterval(start_date, end_date) {
    let dateInterval = '';
    dateInterval += DateUtil.getDate(start_date);
    dateInterval += ' ';
    dateInterval += DateUtil.getLongMonth(start_date);
    dateInterval += ' au ';
    dateInterval += DateUtil.getDate(end_date);
    dateInterval += ' ';
    dateInterval += DateUtil.getLongMonth(end_date);
    dateInterval += ' ';
    dateInterval += DateUtil.getYear(end_date);

    return dateInterval;
  }
}
