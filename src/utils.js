import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration.js';
import {escape as escapeHtml} from 'he';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

dayjs.extend(durationPlugin);

/**
 * @param {string | dayjs.Dayjs} dateTime
 * @param {boolean} [isNarrow] сокращенный формат даты(без месяца)
 * @return {string}
 */
function formatDate(dateTime, isNarrow) {
  return dayjs(dateTime).format(isNarrow ? 'D' : 'MMM D');
}

/**
 * @param {string} startDateTime
 * @param {string} endDateTime
 * @return {string}
 */
function formatDateRange(startDateTime, endDateTime) {
  const start = dayjs(startDateTime);
  const end = dayjs(endDateTime);

  if(start.isSame(end, 'day')) {
    return formatDate(start);
  }

  return [
    formatDate(start),
    formatDate(end, start.isSame(end, 'month'))
  ].join(' - ');
}

console.log(formatDateRange('2023-05-18', '2023-05-18'));

/**
 * @param {string} dateTime
 * @return {string}
 */
function formatTime(dateTime) {
  return dayjs(dateTime).format('HH:mm');
}

/**
 * @param {string} startDateTime
 * @param {string} endDateTime
 * @return {string}
 */
function formatDuration(startDateTime, endDateTime) {
  const ms = dayjs(endDateTime).diff(startDateTime);
  const duration = dayjs.duration(ms);

  if (duration.days()) {
    return duration.format('DD[d] HH[h] mm[m]');
  }

  if (duration.hours()) {
    return duration.format('HH[h] mm[m]');
  }
  return duration.format('mm[m]');
}

/**
 * @param {HTMLInputElement} startDateField
 * @param {HTMLInputElement} endDateField
 * @return {() => void}//после вызова функции flatpickr удаляется и функция ничего не возвращает
 */
function createDatePickers(startDateField, endDateField) {
  /**
   * @type {FlatpickrOptions}
   */
  const options = {
    monthSelectorType: 'static',
    dateFormat: 'Z',
    altInput: true,
    altFormat: 'd/m/y H:i',
    locale: {
      firstDayOfWeek: 1
    },
    enableTime: true,
    'time_24hr': true
  };

  const startDateFlatpickr = flatpickr(startDateField, options);
  const endDateFlatpickr = flatpickr(endDateField, options);

  startDateFlatpickr.set('onChange', (dates) => endDateFlatpickr.set('minDate', dates.at(0)));
  endDateFlatpickr.set('minDate', startDateFlatpickr.selectedDates.at(0));

  return () => {
    startDateFlatpickr.destroy();
    endDateFlatpickr.destroy();
  };
}

class SafeHtml extends String {}

/**
 * @param {TemplateStringsArray} strings
 * @param {...any} values
 * @return {SafeHtml}
 */
//тег для шаблонных строк
function html(strings, ...values) {
  const result = strings.reduce((before, after, index) => {
    const value = values[index - 1];

    if (value === undefined) {
      return before + after;
    }

    if (Array.isArray(value) && value.every((it) => it instanceof SafeHtml)) {
      return before + value.join('') + after;
    }

    if (!(value instanceof SafeHtml)) {
      return before + escapeHtml(String(value)) + after;
    }

    return before + value + after;
  });

  return new SafeHtml(result);
}

export {formatDate, formatTime, formatDuration, SafeHtml, html, createDatePickers};
