import { LoginFormFormError, LoginFormIdError, LoginFormPasswordError } from "./loginForm";
import { defaultState, LoginFormActionType, loginFormReducer } from "./loginForm.reducer";

describe('LoginForm reducer', function(): void {
    it('updates ID field value and resets errors with ChangeIdValue action', function (): void {
        const nextState = loginFormReducer({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                id: {
                    error: LoginFormIdError.required,
                    ok: false,
                    value: '',
                }
            }
        }, {
            type: LoginFormActionType.changeIdValue,
            payload: 'new value',
        });
        expect(nextState).toEqual({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                id: {
                    ok: true,
                    value: 'new value',
                },
            },
        });
    });

    it('updates Password field value and resets errors with ChangePasswordValue action', function (): void {
        const nextState = loginFormReducer({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                password: {
                    error: LoginFormPasswordError.required,
                    ok: false,
                    value: '',
                }
            }
        }, {
            type: LoginFormActionType.changePasswordValue,
            payload: 'new value',
        });
        expect(nextState).toEqual({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                password: {
                    ok: true,
                    value: 'new value',
                },
            },
        });
    });

    it('disables the submit button and clears loading state with the DisableSubmit action', function (): void {
        const nextState = loginFormReducer({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                submit: {
                    disabled: false,
                    loading: true,
                },
            },
        }, {
            type: LoginFormActionType.disableSubmit,
        });
        expect(nextState).toEqual({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                submit: {
                    disabled: true,
                    loading: false,
                },
            },
        });
    });

    it('sets the form error and clears the button loading state with the SetFormError action', function (): void {
        const nextState = loginFormReducer({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                submit: {
                    disabled: false,
                    loading: true,
                },
            },
            ok: true,
        }, {
            type: LoginFormActionType.setFormError,
            payload: LoginFormFormError.badCredentials,
        });
        expect(nextState).toEqual({
            ...defaultState,
            error: LoginFormFormError.badCredentials,
            fields: {
                ...defaultState.fields,
                submit: {
                    disabled: false,
                    loading: false,
                },
            },
            ok: false,
        });
    });

    it('sets the ID field error and clears button loading state with the SetIdError action', function (): void {
        const nextState = loginFormReducer({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                submit: {
                    disabled: false,
                    loading: true,
                },
            },
        }, {
            type: LoginFormActionType.setIdError,
            payload: LoginFormIdError.required,
        });
        expect(nextState).toEqual({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                id: {
                    error: LoginFormIdError.required,
                    ok: false,
                    value: '',
                },
                submit: {
                    disabled: false,
                    loading: false,
                },
            },
        });
    });

    it('sets the Password field error and clears button loading state with the SetPasswordError action', function (): void {
        const nextState = loginFormReducer({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                submit: {
                    disabled: false,
                    loading: true,
                },
            },
        }, {
            type: LoginFormActionType.setPasswordError,
            payload: LoginFormPasswordError.required,
        });
        expect(nextState).toEqual({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                password: {
                    error: LoginFormIdError.required,
                    ok: false,
                    value: '',
                },
                submit: {
                    disabled: false,
                    loading: false,
                },
            },
        });
    });

    it('sets the button loading state with the Submit action', function (): void {
        const nextState = loginFormReducer({
            ...defaultState,
            error: LoginFormFormError.server,
            fields: {
                ...defaultState.fields,
                submit: {
                    disabled: false,
                    loading: false,
                },
            },
            ok: false,
        }, {
            type: LoginFormActionType.submit,
        });
        expect(nextState).toEqual({
            ...defaultState,
            error: undefined,
            fields: {
                ...defaultState.fields,
                submit: {
                    disabled: false,
                    loading: true,
                },
            },
            ok: true,
        });
    });

    it('sets the success state and disables the button with the Success action', function (): void {
        const nextState = loginFormReducer({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                submit: {
                    disabled: false,
                    loading: true,
                },
            },
        }, {
            type: LoginFormActionType.success,
            payload: {
                displayName: 'Test',
            },
        });
        expect(nextState).toEqual({
            ...defaultState,
            fields: {
                ...defaultState.fields,
                submit: {
                    disabled: true,
                    loading: false,
                },
            },
            session: {
                displayName: 'Test',
            },
            success: true,
        });
    });
});
