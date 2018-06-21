
export class DateUtil {
  static formatDay(date) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-CA', options);
  }

  static formatTime(date) {
    const options = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleString('fr-CA', options);
  }
}
