'use client';

import { Box, Button, IconButton, Typography } from "@mui/material";
import { ActionDispatch, FC, FormHTMLAttributes, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import { LoginForm } from "./LoginForm";
import { LoginAlert } from "./LoginAlert";
import { login } from "@/actions/auth";
import { defaultState, LoginFormAction, LoginFormActionType, loginFormReducer } from "@/lib/login/loginForm.reducer";
import { useRouter } from "next/navigation";
import { SessionDispatchContext } from "@/lib/session/context";
import { SessionActionType } from "@/lib/session/session.reducer";
import { LoginFormState } from "@/lib/login/loginForm";
import InputIcon from "@mui/icons-material/Input";

interface Props {}

function useLogIn(formState: LoginFormState): boolean {
    const dispatch = useContext(SessionDispatchContext);
    const dispatched = useRef(false);
    
    if (formState.success && formState.session && !dispatched.current) {
        dispatched.current = true;
    }

    useEffect((): void => {
        if (dispatched.current && formState.session) {
            dispatch({
                type: SessionActionType.create,
                payload: formState.session,
            });
        }
    }, []);

    return dispatched.current;
}

interface CredentialProps {
    dispatch: ActionDispatch<[LoginFormAction]>;
    text: string;
    type: 'id' | 'password';
}

const Credential: FC<CredentialProps> = ({ dispatch, text, type }) => {
    const useCredential = useCallback((): void => {
        dispatch({
            type: type === 'id' ? LoginFormActionType.changeIdValue : LoginFormActionType.changePasswordValue,
            payload: text,
        });
    }, [dispatch, text, type]);

    return <Button
        color="secondary"
        endIcon={<InputIcon color="inherit" fontSize="inherit" />}
        sx={{ mx: 1, textTransform: 'none '}}
        variant="outlined"
        onClick={useCredential}
    >{text}</Button>;
};

export const Login: FC<Props> = () => {
    const [formState, setFormState] = useState(defaultState);
    const loggedIn = useLogIn(formState);
    const router = useRouter();

    const dispatch: ActionDispatch<[LoginFormAction]> = (action) => {
        const nextState = loginFormReducer(formState, action);
        if (nextState !== formState) {
            setFormState(nextState);
        }
    };

    const action: FormHTMLAttributes<HTMLFormElement>['action'] = async (formData) => {
        const submitState = loginFormReducer(formState, {
            type: LoginFormActionType.submit,
        });
        setFormState(submitState);
        const nextState = await login(submitState, formData);
        setFormState(nextState);
    };

    useEffect(() => {
        const timeoutId = loggedIn ? setTimeout((): void => {
            router.replace('/');
        }, 5000) : undefined;
        return (): void => {
            clearTimeout(timeoutId);
        };
    }, [loggedIn]);
    
    return <Box>
        <Typography variant="h1">Log in</Typography>
        <Typography>You must be authenticated to use the app.</Typography>
        <Typography>
            For this demo, use{' '}
            <Credential
                dispatch={dispatch}
                text="test@example.com"
                type="id"
            />
            {' and '}
            <Credential
                dispatch={dispatch}
                text="password1"
                type="password"
            />
            {' '}to login.</Typography>
        <LoginForm
            action={action}
            dispatch={dispatch}
            state={formState}
        />
        <Box sx={{ mt: 2.5 }}>
            <LoginAlert
                error={formState.error}
                success={formState.success}
            />
        </Box>
    </Box>;
};
