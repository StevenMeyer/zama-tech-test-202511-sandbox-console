import { v4 } from "../utils/uuid";
import { IApiKeyNew, IApiKeyResponse, IApiKeyExisting } from "./apiKey.types";
import { ApiKey } from "./apiKey";

/**
 * This is for building data for unit tests ONLY!
 * 
 * It should only be used for data which isn't relevant to the test, such as for setting up existing states.
 * The test should still show "this data in" -> "this data out"; don't hide the first part in a builder.
 */
export class ApiKeyBuilder {
    createdAt: string;
    id: string;
    #key: string;
    #hasKey: boolean;
    isRevoked: boolean;
    expiresAt?: string;
    updatedAt?: string;

    get key(): string | undefined {
        return this.#hasKey ? this.#key : undefined;
    }

    get maskedKey(): string {
        return `********-****-****-****-******${this.#key.substring(this.#key.length - 6)}`;
    }

    #cachedUnconfirmedModel?: ApiKey;
    get unconfirmedModel(): ApiKey {
        return this.#cachedUnconfirmedModel ?? this.buildUnconfirmedModel();
    }

    #cachedModel?: ApiKey;
    get model(): ApiKey {
        return this.#cachedModel ?? this.buildModel();
    }

    constructor(public name: string) {
        this.id = v4();
        this.#key = v4();
        this.#hasKey = false;
        this.createdAt = new Date().toISOString();
        this.isRevoked = false;
    }

    buildIApiKeyNew(): IApiKeyNew {
        return {
            name: this.name,
        };
    }

    buildIApiKeyExisting(): IApiKeyExisting {
        return {
            name: this.name,
            id: this.id,
            maskedKey: this.maskedKey,
            createdAt: this.createdAt,
            expiresAt: this.expiresAt,
            updatedAt: this.updatedAt,
            isRevoked: this.isRevoked,
        };
    }

    buildUnconfirmedModel(): ApiKey {
        const model = new ApiKey(this.buildIApiKeyNew());
        if (this.createdAt) {
            Reflect.set(model, 'createdAt', new Date(this.createdAt));
        }
        this.#cachedUnconfirmedModel = model;
        return model;
    }

    buildModel(): ApiKey {
        this.#cachedModel = new ApiKey({
            ...this.buildIApiKeyExisting(),
            key: this.key,
        });
        return this.#cachedModel;
    }

    buildMapEntry(method: 'buildModel' | 'buildUnconfirmedModel'): [string, ApiKey] {
        const model = this[method]();
        return [model.id, model];
    }

    withCreatedAt(date: string | Date): this {
        this.createdAt = typeof date === 'string' ? date : date.toISOString();
        return this;
    }

    withExpiresAt(date: string | Date | undefined): this {
        this.expiresAt = typeof date === 'string' ? date: date?.toISOString();
        return this;
    }

    withID(id: string): this {
        this.id = id;
        return this;
    }

    withKey(key: string | undefined): this {
        if (!key) {
            this.#hasKey = false;
            return this;
        }
        this.#key = key;
        this.#hasKey = true;
        return this;
    }

    withName(name: string): this {
        this.name = name;
        return this;
    }

    withRevoked(isRevoked = true): this {
        this.isRevoked = isRevoked;
        return this;
    }

    withUpdatedAt(date: string | Date | undefined): this {
        this.updatedAt = typeof date === 'string' ? date : date?.toISOString();
        return this;
    }
}
