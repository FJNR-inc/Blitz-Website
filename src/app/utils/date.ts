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
    const lang = InternationalizationService.getLocale();

    if (lang === 'fr') {
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
    } else {
      if (index === 0) {
        return 'Sunday';
      } else if (index === 1) {
        return 'Monday';
      } else if (index === 2) {
        return 'Tuesday';
      } else if (index === 3) {
        return 'Wednesday';
      } else if (index === 4) {
        return 'Thursday';
      } else if (index === 5) {
        return 'Friday';
      } else if (index === 6) {
        return 'Saturday';
      }
    }
  }

  static getLongMonth(date) {
    const index = date.getMonth();
    const lang = InternationalizationService.getLocale();

    if (lang === 'fr') {
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
    } else {
      if (index === 0) {
        return 'January';
      } else if (index === 1) {
        return 'February';
      } else if (index === 2) {
        return 'March';
      } else if (index === 3) {
        return 'April';
      } else if (index === 4) {
        return 'May';
      } else if (index === 5) {
        return 'June';
      } else if (index === 6) {
        return 'July';
      } else if (index === 7) {
        return 'August';
      } else if (index === 8) {
        return 'September';
      } else if (index === 9) {
        return 'Octobre';
      } else if (index === 10) {
        return 'November';
      } else if (index === 11) {
        return 'December';
      }
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
    const lang = InternationalizationService.getLocale();

    if (lang === 'fr') {
      dateInterval += DateUtil.getDate(start_date);
      dateInterval += ' ';
      dateInterval += DateUtil.getLongMonth(start_date);
      dateInterval += ' au ';
      dateInterval += DateUtil.getDate(end_date);
      dateInterval += ' ';
      dateInterval += DateUtil.getLongMonth(end_date);
      dateInterval += ' ';
      dateInterval += DateUtil.getYear(end_date);
    } else {
      dateInterval += DateUtil.getLongMonth(start_date);
      dateInterval += ' ';
      dateInterval += DateUtil.getDate(start_date);
      dateInterval += ' to ';
      dateInterval += DateUtil.getLongMonth(end_date);
      dateInterval += ' ';
      dateInterval += DateUtil.getDate(end_date);
      dateInterval += ' ';
      dateInterval += DateUtil.getYear(end_date);
    }
    return dateInterval;
  }
}
