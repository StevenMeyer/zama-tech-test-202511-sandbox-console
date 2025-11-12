import { ApiKeyResponse } from "./key";
import { NewKeyFormExpiresAtError, NewKeyFormFormError, NewKeyFormNameError, NewKeyFormState } from "./newKeyForm";

export const enum NewKeyFormActionType {
    changeNameValue,
    changeExpiresAtValue,
    changeNeverExpires,
    setNameError,
    setExpiresAtError,
    setFormError,
    submit,
    success,
}

interface ChangeNameValueAction {
    type: NewKeyFormActionType.changeNameValue;
    payload: string;
}

interface ChangeExpiresAtValueAction {
    type: NewKeyFormActionType.changeExpiresAtValue;
    payload: string;
}

interface ChangeNeverExpiresAction {
    type: NewKeyFormActionType.changeNeverExpires;
    payload: boolean;
}

interface SetNameErrorAction {
    type: NewKeyFormActionType.setNameError;
    payload: NewKeyFormNameError | undefined;
}

interface SetExpiresAtErrorAction {
    type: NewKeyFormActionType.setExpiresAtError;
    payload: NewKeyFormExpiresAtError | undefined;
}

interface SetFormErrorAction {
    type: NewKeyFormActionType.setFormError;
    payload: NewKeyFormFormError | undefined;
}

interface SubmitAction {
    type: NewKeyFormActionType.submit;
    payload?: never;
}

interface SuccessAction {
    type: NewKeyFormActionType.success;
    payload: ApiKeyResponse;
}

export type NewKeyFormAction =
    | ChangeNameValueAction
    | ChangeExpiresAtValueAction
    | ChangeNeverExpiresAction
    | SetNameErrorAction
    | SetExpiresAtErrorAction
    | SetFormErrorAction
    | SubmitAction
    | SuccessAction;

export const defaultState: NewKeyFormState = {
    fields: {
        name: {
            ok: true,
            value: '',
        },
        expiresAt: {
            ok: true,
            value: '',
        },
        neverExpires: {
            value: false,
        },
        submit: {
            disabled: false,
            loading: false,
        },
    },
    ok: true,
    success: false,
};

export function newKeyFormReducer(state: NewKeyFormState, { type, payload }: NewKeyFormAction): NewKeyFormState {
    switch (type) {
        case NewKeyFormActionType.changeNameValue:
            if (payload === state.fields.name.value) {
                return state;
            }
            return {
                ...state,
                fields: {
                    ...state.fields,
                    name: {
                        error: undefined,
                        ok: true,
                        value: payload,
                    },
                },
            };

        case NewKeyFormActionType.changeExpiresAtValue:
            if (payload === state.fields.expiresAt.value) {
                return state;
            }
            return {
                ...state,
                error: state.error === NewKeyFormFormError.noExpireOption ? undefined : state.error,
                fields: {
                    ...state.fields,
                    expiresAt: {
                        error: undefined,
                        ok: true,
                        value: payload,
                    },
                },
                ok: state.error === NewKeyFormFormError.noExpireOption ? true : state.ok,
            };

        case NewKeyFormActionType.changeNeverExpires:
            if (payload === state.fields.neverExpires.value) {
                return state;
            }
            return {
                ...state,
                error: state.error === NewKeyFormFormError.noExpireOption ? undefined : state.error,
                fields: {
                    ...state.fields,
                    neverExpires: {
                        value: payload,
                    },
                },
                ok: state.error === NewKeyFormFormError.noExpireOption ? true : state.ok,
            };

        case NewKeyFormActionType.setExpiresAtError:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    expiresAt: {
                        ...state.fields.expiresAt,
                        error: payload,
                        ok: payload === undefined,
                    },
                    submit: {
                        ...state.fields.submit,
                        loading: false,
                    },
                },
            };

        case NewKeyFormActionType.setFormError:
            return {
                ...state,
                error: payload,
                fields: {
                    ...state.fields,
                    submit: {
                        ...state.fields.submit,
                        loading: false,
                    },
                },
                ok: payload === undefined,
                success: false,
            };

        case NewKeyFormActionType.setNameError:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    name: {
                        ...state.fields.name,
                        error: payload,
                        ok: payload === undefined,
                    },
                    submit: {
                        ...state.fields.submit,
                        loading: false,
                    },
                },
            };

        case NewKeyFormActionType.submit:
            return {
                ...state,
                error: undefined,
                fields: {
                    ...state.fields,
                    submit: {
                        ...state.fields.submit,
                        loading: true,
                    },
                },
                ok: true,
                success: false,
            };

        case NewKeyFormActionType.success:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    submit: {
                        ...state.fields.submit,
                        disabled: true,
                        loading: false,
                    },
                },
                newKey: payload,
                success: true,
            };

        default:
            return state;
    }
}

