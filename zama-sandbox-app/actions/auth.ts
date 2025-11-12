'use server';
import { LoginFormFormError, LoginFormIdError, LoginFormPasswordError, LoginFormState } from "@/lib/login/loginForm";
import { LoginFormActionType, loginFormReducer } from "@/lib/login/loginForm.reducer";
import { createSession, deleteSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

export async function login(state: LoginFormState, formData: FormData): Promise<LoginFormState> {
    await deleteSession();

    const id = formData.get('id');
    const password = formData.get('password');

    let nextState = state;

    if (!id || typeof id !== 'string' || id.trim() === '') {
        nextState = loginFormReducer(nextState, {
            type: LoginFormActionType.changeIdValue,
            payload: '',
        });
        nextState = loginFormReducer(nextState, {
            type: LoginFormActionType.setIdError,
            payload: LoginFormIdError.required,
        });
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
        nextState = loginFormReducer(nextState, {
            type: LoginFormActionType.changePasswordValue,
            payload: '',
        });
        nextState = loginFormReducer(nextState, {
            type: LoginFormActionType.setPasswordError,
            payload: LoginFormPasswordError.required,
        });
    }

    if (!nextState.ok || !nextState.fields.id.ok || !nextState.fields.password.ok) {
        return nextState;
    }

    if (id === 'test@example.com' && password === 'password1') {
        await createSession();
        return loginFormReducer(state, {
            type: LoginFormActionType.success,
            payload: {
                displayName: 'Test User',
            },
        });
    }

    return loginFormReducer(state, {
        type: LoginFormActionType.setFormError,
        payload: LoginFormFormError.badCredentials,
    });
}

export async function logout(): Promise<void> {
    await deleteSession();
    redirect('/');
}