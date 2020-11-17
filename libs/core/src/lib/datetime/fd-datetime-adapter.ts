import { Platform } from '@angular/cdk/platform';
import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';
import { LETTERS_UNICODE_RANGE } from '../utils/consts/unicode-letters.regex';

import { DatetimeAdapter } from './datetime-adapter';
import { FdDate } from './fd-date';
import { range, toIso8601 } from './fd-date.utils';

const AM_DAY_PERIOD_DEFAULT = 'AM';
const PM_DAY_PERIOD_DEFAULT = 'PM';

/**
 * FdDatetimeAdapter implementation
 *
 */

@Injectable()
export class FdDatetimeAdapter extends DatetimeAdapter<FdDate> {
    /** Whether to clamp the date between 1 and 9999 to avoid IE and Edge errors. */
    private readonly _fixYearsRangeIssue: boolean;

    constructor(@Optional() @Inject(LOCALE_ID) localeId: string, platform: Platform) {
        super();

        super.setLocale(localeId);

        this._fixYearsRangeIssue = platform.TRIDENT || platform.EDGE;
    }

    getYear(date: FdDate): number {
        return date.year;
    }

    getMonth(date: FdDate): number {
        return date.month;
    }

    getDate(date: FdDate): number {
        return date.day;
    }

    getDayOfWeek(date: FdDate): number {
        return this._creteDateInstanceByFdDate(date).getDay() + 1;
    }

    getHours(date: FdDate): number {
        return date.hour;
    }

    getMinutes(date: FdDate): number {
        return date.minute;
    }

    getSeconds(date: FdDate): number {
        return date.second;
    }

    getWeekNumber(fdDate: FdDate): number {
        const date = this._creteDateInstanceByFdDate(fdDate);

        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));

        // January 4 is always in week 1.
        const dateInFirstWeek = this._creteDateInstanceByFdDate(new FdDate(fdDate.year, 1, 4));

        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return (
            1 +
            Math.round(
                ((date.getTime() - dateInFirstWeek.getTime()) / 86400000 - 3 + ((dateInFirstWeek.getDay() + 6) % 7)) / 7
            )
        );
    }

    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        const dateTimeFormat = new Intl.DateTimeFormat(this.locale, { month: style, timeZone: 'utc' });
        return range(12, (i) =>
            this._stripDirectionalityCharacters(this._format(dateTimeFormat, new Date(2017, i, 1)))
        );
    }

    getDateNames(): string[] {
        const dateTimeFormat = new Intl.DateTimeFormat(this.locale, { day: 'numeric', timeZone: 'utc' });
        return range(31, (i) =>
            this._stripDirectionalityCharacters(this._format(dateTimeFormat, new Date(2017, 0, i + 1)))
        );
    }

    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        const dateTimeFormat = new Intl.DateTimeFormat(this.locale, { weekday: style, timeZone: 'utc' });
        return range(7, (i) =>
            this._stripDirectionalityCharacters(this._format(dateTimeFormat, new Date(2017, 0, i + 1)))
        );
    }

    getYearName(date: FdDate): string {
        const dateTimeFormat = new Intl.DateTimeFormat(this.locale, { year: 'numeric', timeZone: 'utc' });
        const dateInstance = this._creteDateInstanceByFdDate(date);
        return this._stripDirectionalityCharacters(this._format(dateTimeFormat, dateInstance));
    }

    getWeekName(date: FdDate): string {
        const weekNumber = this.getWeekNumber(date);
        return weekNumber.toLocaleString(this.locale);
    }

    getHourNames({ meridian, twoDigit }: { twoDigit: boolean; meridian: boolean }): string[] {
        return range(24, (hour) => {
            if (meridian) {
                hour = hour === 0 || hour === 12 ? 12 : hour % 12;
            }
            return hour.toLocaleString(this.locale, { minimumIntegerDigits: twoDigit ? 2 : 1 });
        });
    }

    getMinuteNames({ twoDigit }: { twoDigit: boolean }): string[] {
        return range(60, (minute) => {
            return minute.toLocaleString(this.locale, { minimumIntegerDigits: twoDigit ? 2 : 1 });
        });
    }

    getSecondNames({ twoDigit }: { twoDigit: boolean }): string[] {
        return range(60, (second) => {
            return second.toLocaleString(this.locale, { minimumIntegerDigits: twoDigit ? 2 : 1 });
        });
    }

    getDayPeriodNames(): [string, string] {
        const DEFAULT_PERIODS: [string, string] = [AM_DAY_PERIOD_DEFAULT, PM_DAY_PERIOD_DEFAULT];

        const formatter = new Intl.DateTimeFormat(this.locale, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        try {
            const am = formatter.formatToParts(new Date(2020, 0, 1, 6)).find(({ type }) => type === 'dayPeriod').value;
            const pm = formatter.formatToParts(new Date(2020, 0, 1, 16)).find(({ type }) => type === 'dayPeriod').value;

            return am && pm ? [am, pm] : DEFAULT_PERIODS;
        } catch (e) {
            const dayPeriodRegexp = new RegExp(`(${LETTERS_UNICODE_RANGE}+\\.*)+`, 'g');
            const amRegExpMatch = formatter.format(new Date(2020, 0, 1, 6)).match(dayPeriodRegexp);
            const pmRegExpMatch = formatter.format(new Date(2020, 0, 1, 16)).match(dayPeriodRegexp);

            return amRegExpMatch && pmRegExpMatch
                ? [amRegExpMatch[0], pmRegExpMatch[0]]
                : [AM_DAY_PERIOD_DEFAULT, PM_DAY_PERIOD_DEFAULT];
        }
    }

    setHours(date: FdDate, hours: number): FdDate {
        const dateInstance = this._creteDateInstanceByFdDate(date);
        dateInstance.setHours(hours);
        return this._creteFdDateFromDateInstance(dateInstance);
    }

    setMinutes(date: FdDate, hours: number): FdDate {
        const dateInstance = this._creteDateInstanceByFdDate(date);
        dateInstance.setMinutes(hours);
        return this._creteFdDateFromDateInstance(dateInstance);
    }

    setSeconds(date: FdDate, hours: number): FdDate {
        const dateInstance = this._creteDateInstanceByFdDate(date);
        dateInstance.setSeconds(hours);
        return this._creteFdDateFromDateInstance(dateInstance);
    }

    getFirstDayOfWeek(): number {
        // can't retrieve this info from Intl object or Date object, default to Sunday.
        return 0;
    }

    getNumDaysInMonth(fdDate: FdDate): number {
        const date = this._creteDateInstanceByFdDate(fdDate);
        date.setMonth(date.getMonth() + 1);
        date.setDate(0);
        return date.getDate();
    }

    createDate(year: number, month = 1, date = 1): FdDate {
        return new FdDate(year, month, date);
    }

    today(): FdDate {
        return FdDate.getNow();
    }

    parse(value: any): FdDate | null {
        if (value instanceof FdDate) {
            return this.clone(value);
        }
        /**
         * We have no way using the native JS Date to set the parse format or locale,
         * so we ignore these parameters.
         */
        let date = new Date(Date.parse(value));
        if (typeof value === 'number') {
            date = new Date(value);
        }
        return Number.isNaN(date.valueOf()) ? null : this._creteFdDateFromDateInstance(date);
    }

    format(date: FdDate, displayFormat: Object): string {
        if (!this.isValid(date)) {
            throw Error('FdDateAdapter: Cannot format invalid date.');
        }

        // On IE and Edge the i18n API will throw a hard error that can crash the entire app
        // if we attempt to format a date whose year is less than 1 or greater than 9999.
        if (this._fixYearsRangeIssue && (date.year < 1 || date.year > 9999)) {
            date = this.clone(date);
            date.year = Math.max(1, Math.min(9999, date.year));
        }

        displayFormat = { ...displayFormat, timeZone: 'utc' };

        const dateTimeFormatter = new Intl.DateTimeFormat(this.locale, displayFormat);
        const dateInstance = this._creteDateInstanceByFdDate(date);
        return this._stripDirectionalityCharacters(this._format(dateTimeFormatter, dateInstance));
    }

    addCalendarYears(date: FdDate, years: number): FdDate {
        return this.addCalendarMonths(date, years * 12);
    }

    addCalendarMonths(fdDate: FdDate, months: number): FdDate {
        const date = this._creteDateInstanceByFdDate(fdDate);

        date.setMonth(date.getMonth() + months);

        // It's possible to wind up in the wrong month if the original month has more days than the new
        // month. In this case we want to go to the last day of the desired month.
        if (date.getDate() !== fdDate.day) {
            date.setDate(0);
        }

        return this._creteFdDateFromDateInstance(date);
    }

    addCalendarDays(fdDate: FdDate, days: number): FdDate {
        const date = this._creteDateInstanceByFdDate(fdDate);
        date.setDate(date.getDate() + days);
        return this._creteFdDateFromDateInstance(date);
    }

    getAmountOfWeeks(year: number, month: number, firstDayOfWeek: number): number {
        const firstOfMonth = new Date(year, month - 1, 1);
        const lastOfMonth = new Date(year, month, 0);

        const dayOffset = (firstOfMonth.getDay() - firstDayOfWeek + 6) % 7;
        const used = dayOffset + lastOfMonth.getDate();

        return Math.ceil(used / 7);
    }

    clone(date: FdDate): FdDate {
        return new FdDate(date.year, date.month, date.day, date.hour, date.minute, date.second);
    }

    isValid(date: FdDate): boolean {
        if (!(date instanceof FdDate)) {
            return false;
        }
        const nativeDate = this._creteDateInstanceByFdDate(date);
        return (
            nativeDate.getFullYear() === date.year &&
            nativeDate.getMonth() + 1 === date.month &&
            nativeDate.getDate() === date.day
        );
    }

    isBetween(dateToCheck: FdDate, startDate: FdDate, endDate: FdDate): boolean {
        const date = this._creteDateInstanceByFdDate(dateToCheck);
        const start = this._creteDateInstanceByFdDate(startDate);
        const end = this._creteDateInstanceByFdDate(endDate);
        return date.getTime() > start.getTime() && date.getTime() < end.getTime();
    }

    datesEqual(date1: FdDate, date2: FdDate): boolean {
        if (!date1 || !date2) {
            return false;
        }
        // reset time value
        const date1Str = this.toIso8601(date1).split('T')[0];
        const date2Str = this.toIso8601(date2).split('T')[0];
        return date1Str === date2Str;
    }

    dateTimesEqual(date1: FdDate, date2: FdDate): boolean {
        if (!date1 || !date2) {
            return false;
        }
        const date1Str = this.toIso8601(date1).split('T');
        const date2Str = this.toIso8601(date2).split('T');
        return date1Str === date2Str;
    }

    toIso8601(fdDate: FdDate): string {
        return toIso8601(fdDate);
    }

    isTimeFormatIncludesDayPeriod(displayFormat: any): boolean {
        if (typeof displayFormat?.hour12 === 'boolean') {
            return displayFormat.hour12;
        }
        const formattedDateNoPeriodOption = this.format(this.createDate(2020), displayFormat);
        const formattedDateWithPeriodOption = this.format(this.createDate(2020), { ...displayFormat, hour12: true });
        return formattedDateWithPeriodOption === formattedDateNoPeriodOption;
    }

    isTimeFormatIncludesHours(displayFormat: any): boolean {
        return typeof displayFormat?.hour === 'string';
    }

    isTimeFormatIncludesMinutes(displayFormat: any): boolean {
        return typeof displayFormat?.minute === 'string';
    }

    isTimeFormatIncludesSeconds(displayFormat: any): boolean {
        return typeof displayFormat?.second === 'string';
    }

    /**
     * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
     * other browsers do not. We remove them to make output consistent and because they interfere with
     * date parsing.
     * @param str The string to strip direction characters from.
     * @returns The stripped string.
     */
    private _stripDirectionalityCharacters(str: string): string {
        return str.replace(/[\u200e\u200f]/g, '');
    }

    /**
     * Create native Date instance from FdDate
     * @param date FdDate instance
     * @returns date Native date instance
     */
    private _creteDateInstanceByFdDate({ year, month, day: dayOfMonth, hour, minute, second }: FdDate): Date {
        const date = new Date(2020);
        date.setFullYear(year);
        date.setMonth(month - 1);
        date.setDate(dayOfMonth);
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(second);
        date.setMilliseconds(0);
        return date;
    }

    /**
     * Create native Date instance in UTC
     * @param year The year
     * @param month The month as a number between 0 and 11
     * @param date The date as a number between 1 and 31.
     * @param hours The hours as a number between 0 - 24
     * @param minutes The minutes as a number between 0 - 59
     * @param seconds The seconds as a number between 0 - 59
     * @param milliseconds The milliseconds as a number between 0 - 59
     */
    private _creteUTCDateInstance(
        year: number,
        month: number,
        date: number,
        hours = 0,
        minutes = 0,
        seconds = 0,
        milliseconds = 0
    ): Date {
        const utcDate = new Date(2020);
        utcDate.setUTCFullYear(year);
        utcDate.setUTCMonth(month);
        utcDate.setUTCDate(date);
        utcDate.setUTCHours(hours);
        utcDate.setUTCMinutes(minutes);
        utcDate.setUTCSeconds(seconds);
        utcDate.setUTCMilliseconds(milliseconds);
        return utcDate;
    }

    private _format(formatter: Intl.DateTimeFormat, date: Date): string {
        date = this._creteUTCDateInstance(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        );
        return formatter.format(date);
    }

    private _creteFdDateFromDateInstance(date: Date): FdDate {
        return new FdDate(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        );
    }
}
