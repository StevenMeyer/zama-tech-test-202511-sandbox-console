export interface IApiKeyNew {
    /** A human-readable name for the API key */
    name: string;
    /** The date and time the API key will expire. */
    expiresAt?: string;
}

export interface IApiKeyExisting extends IApiKeyNew {
    /** The unique identifier for the API key. Not the API key itself. */
    id: string;
    /** The masked key will be used to display the API key in the frontend. */
    maskedKey: string;
    /** The date and time the API key was created. */
    createdAt: string;
    /** The date and time the API key was last updated. */
    updatedAt?: string;
    /** Has the key been revoked? */
    isRevoked: boolean;
}

export interface IApiKeyResponse extends IApiKeyExisting {
    /** If we have a pending key with this id, we know we should update it with this response. */
    appId?: string;
    /** The full key will only be provided one time when the API key is created. */
    key?: string;
}