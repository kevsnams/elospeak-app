/**
 * This function creates a URL relative to the applications base URL
 * 
 * @param {String} path The path that will be created
 * @returns The full url
 */
export function url(path = '/')
{
    return `__APP_URL__${path}`;
}




/**
 * This function creates a human readable date
 * 
 * @param {Date} date The date to format
 * @returns The formatted string
 */
export function date_human(date = new Date())
{
    return `${ date.getDate() } ${ DATE_MONTHS[date.getMonth() + 1] } ${ date.getFullYear() }, ${ DAY_NAMES[date.getDay()] }`
}




/**
 * Creates a HH:MM time format
 * 
 * @param {Date} date `Default: new Date()` The Date object to to format
 * @param {Boolean} ampm `Default: false` if TRUE sets to 12-hour format. 24-format if FALSE
 * @param {Boolean} isLZ `Default: true` if TRUE adds leading zero to the number
 * @returns The formatted time
 */
export function time_hm(date = new Date(), ampm = false, isLZ = true)
{
    const hour = date.getHours();
    let fhour = ampm ? ( hour <= 12 ? hour : hour - 12) : hour;
    fhour = isLZ ? lz(fhour) : fhour;

    const mer = ampm ? ( hour - 12 < 0 ? ' AM' : ' PM') : '';
    const minute = isLZ ? lz(date.getMinutes()) : date.getMinutes();

    return `${ fhour }:${ minute }${ mer }`;
}




/**
 * Adds a leading-zero to the number
 * 
 * @param {Number} n The number to add leading zero
 */
export function lz(n)
{
    return n < 10 ? `0${n}` : n;
}




/**
 * Calculates the duration of a class.  
 * `start` and `end` is a datetime string from `classroom.start`/`classroom.end`
 * 
 * @param {String} start The datetime string of classroom's start
 * @param {String} end The datetime string of classroom's end
 * @returns The calculated duration. Note: The return value is passed through `Math.floor()`
 */
export function class_duration(start, end)
{
    const s = +(new Date(start));
    const e = +(new Date(end));

    return Math.floor(((e - s) / 1000) / 60);
}




/**
 * This function adds comma(s) to a number if necessary
 * 
 * @param {Number} number The number to add commas
 * @param {String} separator `Default: ','` The separator character
 * @returns The comma separated number
 */
export function number_format(number, separator = ',')
{
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}




export function pluralize(basis, singularForm, pluralForm)
{
    if (basis <= 1) {
        return singularForm;
    }

    return pluralForm;
}




export const DATE_MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];




export const DATE_MONTHS_SHORT = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];




export const DAY_NAMES = [
    'Sunday', 
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];




export const DAY_NAMES_SHORT = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
];
