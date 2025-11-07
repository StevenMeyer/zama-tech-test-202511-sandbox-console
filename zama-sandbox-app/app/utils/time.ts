/** Returns an ISO date without time as YYYY-MM-DD, like 2020-12-31 */
export function getISODate(date: Date): string {
    const month = (date.getMonth() + 1).toString(10).padStart(2, '0');
    const day = date.getDate().toString(10).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

/** Returns the time as HH:mm */
export function getTime(date: Date): string {
    const hour = date.getHours().toString(10).padStart(2, '0');
    const minute = date.getMinutes().toString(10).padStart(2, '0');
    return `${hour}:${minute}`;
}

export function getDateTimeOmitSameDay(date: Date): string {
    const now = new Date();
    const dateStr = getISODate(date);
    if (dateStr === getISODate(now)) {
        return getTime(date);
    }
    return `${dateStr} ${getTime(date)}`;
}