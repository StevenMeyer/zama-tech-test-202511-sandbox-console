"use client";
import { FC, useEffect, useRef } from "react"
import { LoginForm } from "./LoginForm";
import { LoginFormState } from "./reducer";
import { Box, Typography } from "@mui/material";
import { loginAction } from "./login.action";

interface Props {}

export const Login: FC<Props> = function Login() {
    const abortControllerRef = useRef<AbortController>(new AbortController());

    useEffect(() => {
        const abortController = abortControllerRef.current;
        return (): void => {
            abortController.abort();
        };
    }, []);

    return <Box>
        <Typography variant="h1">Login</Typography>
        <LoginForm
            signal={abortControllerRef.current.signal}
            submitAction={loginAction}
        />
    </Box>;
};
