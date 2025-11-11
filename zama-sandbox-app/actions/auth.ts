'use server';
import { LoginFormFormError, LoginFormIdError, LoginFormPasswordError, LoginFormState } from "@/lib/login/loginForm";
import { LoginFormActionType, loginFormReducer } from "@/lib/login/loginForm.reducer";
import { createSession, deleteSession } from "@/lib/session/session";
import { redirect } from "next/navigation";

export async function login(state: LoginFormState, formData: FormData): Promise<LoginFormState> {
    await deleteSession();

    const id = formData.get('id');
    const password = formData.get('password');

    let idError: LoginFormIdError | undefined;
    let passwordError: LoginFormPasswordError | undefined;

    if (!id || typeof id !== 'string' || id.trim() === '') {
        idError = LoginFormIdError.required;
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
        passwordError = LoginFormPasswordError.required;
    }
    if (idError !== undefined || passwordError !== undefined) {
        return loginFormReducer(
            loginFormReducer(state, {
                type: LoginFormActionType.setIdError,
                payload: idError,
            }),
            {
                type: LoginFormActionType.setPasswordError,
                payload: passwordError,
            },
        );
    }

    if (id === 'test@example.com' && password === 'password1') {
        await createSession();
        return loginFormReducer(state, {
            type: LoginFormActionType.success,
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