/** Returns the local date as YYYY-MM-DD */
export function getISODateLocal(date: string | Date): string {
    const dateInstance = date instanceof Date ? date : new Date(date);
    if (!isValidDate(dateInstance)) {
        return 'Malformed date';
    }
    const month = (dateInstance.getMonth() + 1).toString(10).padStart(2, '0');
    const day = dateInstance.getDate().toString(10).padStart(2, '0');
    return `${dateInstance.getFullYear()}-${month}-${day}`;
}

/** Return the UTC date as YYYY-MM-DD */
export function getISODateUTC(date: string | Date): string {
    const dateInstance = date instanceof Date ? date : new Date(date);
    if (!isValidDate(dateInstance)) {
        return 'Malformed date';
    }
    const month = (dateInstance.getUTCMonth() + 1).toString(10).padStart(2, '0');
    const day = dateInstance.getUTCDate().toString(10).padStart(2, '0');
    return `${dateInstance.getUTCFullYear()}-${month}-${day}`;
}

/** Returns the local time as HH:mm */
export function getTimeLocal(date: string | Date): string {
    const dateInstance = date instanceof Date ? date : new Date(date);
    if (!isValidDate(dateInstance)) {
        return 'Malformed date';
    }
    const hour = dateInstance.getHours().toString(10).padStart(2, '0');
    const minute = dateInstance.getMinutes().toString(10).padStart(2, '0');
    return `${hour}:${minute}`;
}

/** Returns the UTC time as HH:mm */
export function getTimeUTC(date: string | Date): string {
    const dateInstance = date instanceof Date ? date : new Date(date);
    if (!isValidDate(dateInstance)) {
        return 'Malformed date';
    }
    const hour = dateInstance.getUTCHours().toString(10).padStart(2, '0');
    const minute = dateInstance.getUTCMinutes().toString(10).padStart(2, '0');
    return `${hour}:${minute}`;
}

/** Returns the local date and time as YYYY-MM-DD HH:mm. Optionally hide date if same day. */
export function getDateTimeLocal(date: string | Date, options?: { omitSameDay?: boolean }): string {
    const dateInstance = date instanceof Date ? date : new Date(date);
    if (!isValidDate(dateInstance)) {
        return 'Malformed date';
    }
    const dateStr = getISODateLocal(dateInstance);
    if (options?.omitSameDay) {
        const now = new Date();
        if (dateStr === getISODateLocal(now)) {
            return getTimeLocal(date);
        }
    }
    return `${dateStr} ${getTimeLocal(dateInstance)}`
}

/** Returns the UTC date and time as YYYY-MM-DD HH:mm. */
export function getDateTimeUTC(date: string | Date): string {
    const dateInstance = date instanceof Date ? date : new Date(date);
    if (!isValidDate(dateInstance)) {
        return 'Malformed date';
    }
    return `${getISODateUTC(dateInstance)} ${getTimeUTC(dateInstance)}`
}

export function isValidDate(date: string | Date): boolean {
    const dateInstance = date instanceof Date ? date : new Date(date);
    return dateInstance.toString() !== 'Invalid Date';
}
