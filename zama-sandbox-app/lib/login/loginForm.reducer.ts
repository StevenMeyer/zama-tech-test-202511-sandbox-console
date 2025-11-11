import { LoginFormFormError, LoginFormIdError, LoginFormPasswordError, LoginFormState } from "./loginForm";

export const enum LoginFormActionType {
    changeIdValue,
    changePasswordValue,
    disableSubmit,
    setFormError,
    setIdError,
    setPasswordError,
    submit,
    success,
}

interface ChangeIdValueAction {
    type: LoginFormActionType.changeIdValue;
    payload: string;
}

interface ChangePasswordValueAction {
    type: LoginFormActionType.changePasswordValue;
    payload: string;
}

interface DisableSubmitAction {
    type: LoginFormActionType.disableSubmit;
    payload?: never;
}

interface SetFormErrorAction {
    type: LoginFormActionType.setFormError;
    payload: LoginFormFormError | undefined;
}

interface SetIdErrorAction {
    type: LoginFormActionType.setIdError;
    payload: LoginFormIdError | undefined;
}

interface SetPasswordErrorAction {
    type: LoginFormActionType.setPasswordError;
    payload: LoginFormPasswordError | undefined;
}

interface SubmitAction {
    type: LoginFormActionType.submit;
    payload?: never;
}

interface SuccessAction {
    type: LoginFormActionType.success,
    payload?: never;
}

export type LoginFormAction =
    | ChangeIdValueAction
    | ChangePasswordValueAction
    | DisableSubmitAction
    | SetFormErrorAction
    | SetIdErrorAction
    | SetPasswordErrorAction
    | SubmitAction
    | SuccessAction

export const defaultState: LoginFormState = {
    fields: {
        id: {
            ok: true,
            value: '',
        },
        password: {
            ok: true,
            value: '',
        },
        submit: {
            disabled: false,
            loading: false,
        }
    },
    ok: true,
    success: false,
};

export function loginFormReducer(state: LoginFormState, { type, payload }: LoginFormAction): LoginFormState {
    switch (type) {
        case LoginFormActionType.changeIdValue:
            if (payload === state.fields.id.value) {
                return state;
            }
            return {
                ...state,
                fields: {
                    ...state.fields,
                    id: {
                        ok: true,
                        value: payload,
                    },
                },
            };

        case LoginFormActionType.changePasswordValue:
            if (payload === state.fields.password.value) {
                return state;
            }
            return {
                ...state,
                fields: {
                    ...state.fields,
                    password: {
                        ok: true,
                        value: payload,
                    },
                },
            };

        case LoginFormActionType.disableSubmit:
            return {
                ...state,
                fields: {
                    ...state.fields,
                    submit: {
                        disabled: true,
                        loading: false,
                    }
                },
            };

        case LoginFormActionType.setFormError:
            if (payload === state.error) {
                return state;
            }
            return {
                ...state,
                error: payload,
                fields: {
                    ...state.fields,
                    submit: {
                        ...state.fields.submit,
                        loading: false,
                    }
                },
                ok: payload === undefined,
            };
        
        case LoginFormActionType.setIdError:
            if (payload === state.fields.id.error) {
                return state;
            }
            return {
                ...state,
                fields: {
                    ...state.fields,
                    id: {
                        ...state.fields.id,
                        error: payload,
                        ok: payload === undefined,
                    },
                    submit: {
                        ...state.fields.submit,
                        loading: false,
                    }
                },
            };
        
            case LoginFormActionType.setPasswordError:
                if (payload === state.fields.password.error) {
                    return state;
                }
                return {
                    ...state,
                    fields: {
                        ...state.fields,
                        password: {
                            ...state.fields.password,
                            error: payload,
                            ok: payload === undefined,
                        },
                        submit: {
                            ...state.fields.submit,
                            loading: false,
                        }
                    },
                };

            case LoginFormActionType.submit:
                if (state.fields.submit.loading) {
                    return state;
                }
                return {
                    ...state,
                    error: undefined,
                    fields: {
                        ...state.fields,
                        submit: {
                            disabled: false,
                            loading: true,
                        },
                    },
                    ok: true,
                };

            case LoginFormActionType.success:
                if (state.success) {
                    return state;
                }
                return {
                    ...state,
                    error: undefined,
                    fields: {
                        ...state.fields,
                        submit: {
                            disabled: true,
                            loading: false,
                        },
                    },
                    ok: true,
                    success: true,
                };
        default:
            return state;
    }
}