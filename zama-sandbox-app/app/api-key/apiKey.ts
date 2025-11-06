import { v4 } from "../utils/uuid";
import { IApiKeyNew, IApiKeyResponse, IApiKeyExisting } from "./apiKey.types";

/** Checks for a correctly formatted date string and returns a Date object. */
function createValidDate(name: keyof {[K in keyof IApiKeyResponse as IApiKeyResponse[K] extends string | number | undefined ? K : never]: IApiKeyResponse[K]}, seed: IApiKeyResponse): Date {
    const dateString = seed[name];
    const date = new Date(seed[name] ?? NaN);
    if (date.toString() === 'Invalid Date') {
        throw new Error(`Invalid ${name} date: ${dateString}`);
    }
    return date;
}

export class ApiKey implements Readonly<Omit<IApiKeyExisting, 'createdAt' | 'expiresAt' | 'updatedAt'>> {
    /** The date and time the API key was created. */
    readonly createdAt: Date;
    /** The date and time the API key will expire. */
    readonly expiresAt?: Date;
    /** The date and time the API key was last updated. */
    readonly updatedAt?: Date;
    readonly maskedKey: string;
    readonly name: string;
    /** The full key will only be provided one time when the API key is created. */
    readonly key?: string;
    readonly isRevoked: boolean;

    #tempId?: string;
    #id?: string;
    get id(): string {
        return this.#id ?? this.#tempId!;
    }

    /** Whether the key has been shown to the user */
    get hasUnseenKey(): boolean {
        return !!this.key;
    }

    /** Whether the API key has expired. */
    get isExpired(): boolean {
        return this.expiresAt ? this.expiresAt < new Date() : false;
    }

    /** The response came from the backend confirming this key was created. */
    get isConfirmedCreated(): boolean {
        return !!this.#id;
    }

    constructor(seed: IApiKeyNew | IApiKeyResponse) {
        this.name = seed.name;
        if ('id' in seed && 'maskedKey' in seed && 'createdAt' in seed) {
            this.#id = seed.id;
            this.maskedKey = seed.maskedKey;
            this.createdAt = createValidDate('createdAt', seed);
            this.expiresAt = seed.expiresAt ? createValidDate('expiresAt', seed) : undefined;
            this.updatedAt = seed.updatedAt ? createValidDate('updatedAt', seed) : undefined;
            this.isRevoked = seed.isRevoked;
            if ('key' in seed) {
                this.key = seed.key;
            }
        } else {
            this.#tempId = v4();
            this.maskedKey = '********-****-****-****-************';
            this.createdAt = new Date();
            this.isRevoked = false;
        }
    }

    [Symbol.toPrimitive](): string {
        return this.maskedKey;
    }

    toJSON(): IApiKeyExisting {
        return {
            id: this.id,
            name: this.name,
            maskedKey: this.maskedKey,
            createdAt: this.createdAt.toISOString(),
            expiresAt: this.expiresAt?.toISOString(),
            updatedAt: this.updatedAt?.toISOString(),
            isRevoked: this.isRevoked,
        };
    }
}