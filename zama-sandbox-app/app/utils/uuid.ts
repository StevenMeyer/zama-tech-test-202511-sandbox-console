function makeRandomishHexString(length: number): string {
    return Math.floor(Math.random() * Math.pow(16, length)).toString(16).toUpperCase();
}

/**
 * Creates a UUID v4-like string. Good enough for this demo.
 */
export function v4(): string {
    return `${makeRandomishHexString(8)}-566D-4EF0-9C22-186B2${makeRandomishHexString(7)}`;
}
