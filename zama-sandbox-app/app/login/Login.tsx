import { FC, useEffect, useRef } from "react"
import { LoginForm } from "./LoginForm";
import { ActionType, loginFormReducer, LoginFormState } from "./reducer";
import { User } from "../user/user";

interface Props {}

async function loginAction(state: LoginFormState, formData: FormData): Promise<LoginFormState> {
    const id = formData.get('id');
    const password = formData.get('password');
    if (id === null || typeof id !== 'string' || id.trim() === '' || password === null || typeof password !== 'string') {
        return loginFormReducer(state, ActionType.BadFormEntry);
    }
    try {
        const response = await fetch('/api/identity', {
            body: formData,
            cache: 'no-cache',
            method: 'POST',
            signal: state.signal,
        });
        if (response.ok) {
            const user: User = await response.json();
            if (typeof user !== 'object' || !user.id || !user.token) {
                return loginFormReducer(state, ActionType.ServerError);
            }
            sessionStorage.setItem('token', user.token);
            return loginFormReducer(state, ActionType.Success);
        }
        if (response.status === 401) {
            return loginFormReducer(state, ActionType.Forbidden);
        }
        return loginFormReducer(state, ActionType.ServerError);
    } catch (_) {
        return state;
    }
}

export const Login: FC<Props> = function Login() {
    const abortControllerRef = useRef<AbortController>(new AbortController());

    useEffect(() => {
        const abortController = abortControllerRef.current;
        return (): void => {
            abortController.abort();
        };
    }, []);

    return <LoginForm
        signal={abortControllerRef.current.signal}
        submitAction={loginAction}
    />;
};
