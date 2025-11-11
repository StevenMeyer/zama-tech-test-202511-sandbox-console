'use client';

import { Box, Typography } from "@mui/material";
import { ActionDispatch, FC, FormHTMLAttributes, useEffect, useState } from "react";
import { LoginForm } from "./LoginForm";
import { LoginAlert } from "./LoginAlert";
import { login } from "@/actions/auth";
import { defaultState, LoginFormAction, LoginFormActionType, loginFormReducer } from "@/lib/login/loginForm.reducer";
import { useRouter } from "next/navigation";

interface Props {}

export const Login: FC<Props> = () => {
    const [formState, setFormState] = useState(defaultState);
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
        const timeoutId = formState.success ? setTimeout((): void => {
            router.replace('/');
        }, 5000) : undefined;
        return (): void => {
            clearTimeout(timeoutId);
        };
    }, [formState.success]);
    
    return <Box>
        <Typography variant="h1">Log in</Typography>
        <Typography>You must be authenticated to use the app.</Typography>
        <LoginForm
            action={action}
            dispatch={dispatch}
            state={formState}
        />
        <LoginAlert
            error={formState.error}
            success={formState.success}
        />
    </Box>;
};
