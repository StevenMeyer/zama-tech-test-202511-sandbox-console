import { ApiKeyResponse } from "./key";

export const enum NewKeyFormNameError {
    required,
}

export const enum NewKeyFormExpiresAtError {
    valueInPast,
}

export const enum NewKeyFormFormError {
    noExpireOption,
    notAuthorized,
    server,
}

export interface NewKeyFormState {
    error?: NewKeyFormFormError;
    readonly fields: {
        readonly name: {
            error?: NewKeyFormNameError;
            ok: boolean;
            value: string;
        };
        readonly expiresAt: {
            error?: NewKeyFormExpiresAtError,
            ok: boolean;
            value: string;
        };
        readonly neverExpires: {
            value: boolean,
        };
        readonly submit: {
            disabled: boolean;
            loading: boolean;
        };
    };
    newKey?: ApiKeyResponse;
    ok: boolean;
    success: boolean;
}