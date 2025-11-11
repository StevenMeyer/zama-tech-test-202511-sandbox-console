export const enum LoginFormIdError {
    required,
}

export const enum LoginFormPasswordError {
    required,
}

export const enum LoginFormFormError {
    badCredentials,
    server,
}

export interface LoginFormState {
    readonly fields: {
        readonly id: {
            error?: LoginFormIdError;
            ok: boolean;
            value: string;
        };
        readonly password: {
            error?: LoginFormPasswordError;
            ok: boolean;
            value: string;
        }
        readonly submit: {
            disabled: boolean;
            loading: boolean;
        }
    };
    error?: LoginFormFormError;
    ok: boolean;
    success: boolean;
}