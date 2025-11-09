export const enum ActionType {
    BadFormEntry,
    Forbidden,
    ServerError,
    Success,
}

export const enum ErrorType {
    credentials,
    server,
}

export interface LoginFormState {
    error?: {
        type: ErrorType;
    };
    signal: AbortSignal;
    success: boolean;
}

export function loginFormReducer(state: LoginFormState, action: ActionType): LoginFormState {
    if (action === ActionType.Success) {
        return {
            ...state,
            error: undefined,
            success: true,
        };
    }

    if (action === ActionType.Forbidden) {
        return {
            ...state,
            error: {
                type: ErrorType.credentials,
            },
            success: false,
        };
    }

    if (action === ActionType.ServerError) {
        return {
            ...state,
            error: {
                type: ErrorType.server,
            },
            success: false,
        };
    }

    if (action === ActionType.BadFormEntry) {
        return {
            ...state,
            error: {
                type: ErrorType.credentials,
            },
            success: false,
        };
    }

    return state;
}