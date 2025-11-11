export const enum AuthStateIdError {
    required,
}

export const enum AuthStatePasswordError {
    required,
}

export const enum AuthStateGeneralError {
    badCredentials,
    serverError,
}

export interface Identity {
    readonly id: string;
    displayName: string;
}

export interface AuthStateInput<E extends AuthStateIdError | AuthStatePasswordError> {
    error?: E;
    value: string;
}

export interface AuthState {
    readonly id: AuthStateInput<AuthStateIdError> & {
        readonly ok: boolean;
    };
    readonly password: AuthStateInput<AuthStatePasswordError> & {
        readonly ok: boolean;
    };
    error?: AuthStateGeneralError;
    readonly ok: boolean;
    identity?: Identity;
}