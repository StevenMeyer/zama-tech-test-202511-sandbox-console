import { IApiKeyResponse } from "../api-key/apiKey.types";

export const enum NameErrorType {
    required,
}

export const enum ExpiresAtErrorType {
    tooSmall,
}

export const enum FormErrorType {
    NoExpiresAtDateOrNeverExpiresOption,
    NotAuthorised,
    Other,
}

interface InputState<E extends NameErrorType | ExpiresAtErrorType> {
    error?: E;
    readonly ok: boolean;
}

export class CreateKeyState {
    createdKey?: IApiKeyResponse;
    error?: FormErrorType;
    readonly expiresAt: InputState<ExpiresAtErrorType>;
    readonly name: InputState<NameErrorType>;

    get ok(): boolean {
        return this.error === undefined && this.expiresAt.ok && this.name.ok;
    }

    constructor(readonly signal: AbortSignal, {error, nameError, expiresAtError}: { nameError?: NameErrorType; expiresAtError?: ExpiresAtErrorType; error?: FormErrorType; } = {}) {
        this.error = error;
        this.expiresAt = {
            error: expiresAtError,
            get ok(): boolean {
                return this.error === undefined; // "this" is InputState
            },
        };
        this.name = {
            error: nameError,
            get ok(): boolean {
                return this.error === undefined;
            },
        };
    }

    static fromState(prevState: CreateKeyState): CreateKeyState {
        return new CreateKeyState(prevState.signal, {
            error: prevState.error,
            expiresAtError: prevState.expiresAt.error,
            nameError: prevState.name.error,
        });
    }
}

export async function createKeyAction(state: CreateKeyState, formData: FormData): Promise<CreateKeyState> {
    const name = formData.get('name');
    const expiresAt = formData.get('expiresAt');
    const neverExpires = formData.get('neverExpires');

    let nameError: NameErrorType | undefined;
    let expiresAtError: ExpiresAtErrorType | undefined;
    let formError: FormErrorType | undefined;

    const nameValue = (name as string | null)?.trim();
    const expiresAtValue = (expiresAt as string | null)?.trim();
    const neverExpiresValue = neverExpires === 'checked';

    if (!nameValue) {
        nameError = NameErrorType.required;
    }

    if (!neverExpiresValue) {
        if (!expiresAtValue) {
            formError = FormErrorType.NoExpiresAtDateOrNeverExpiresOption;
        } else if (new Date(`${expiresAtValue}:00.000`) <= new Date()) {
            expiresAtError = ExpiresAtErrorType.tooSmall;
        }
    }

    if (formError || expiresAtError || nameError) {
        return new CreateKeyState(state.signal, {
            error: formError,
            expiresAtError,
            nameError,
        });
    }

    try {
        const response = await fetch('/api/key', {
            body: JSON.stringify({
                name: nameValue,
                expiresAt: neverExpiresValue ? undefined : `${expiresAt}:00.000`,
            }),
            method: 'POST',
        });
        if (response.ok) {
            const nextState = new CreateKeyState(state.signal);
            nextState.createdKey = await response.json();
            return nextState;
        }
        if (response.status === 401) {
            return new CreateKeyState(state.signal, {
                error: FormErrorType.NotAuthorised,
            });
        }
        return new CreateKeyState(state.signal, {
            error: FormErrorType.Other,
        });
    } catch (_) {
        return new CreateKeyState(state.signal, {
            error: FormErrorType.Other,
        });
    }
}