"use client";
import { FC, useActionState, useEffect, useRef } from "react"
import { LoginForm } from "./LoginForm";
import { Box } from "@mui/material";
import { loginAction } from "./login.action";
import { LoginFormAlert } from "./LoginAlert";
import { useRouter } from "next/navigation";

interface Props {}

export const Login: FC<Props> = function Login() {
    const abortControllerRef = useRef<AbortController>(new AbortController());
    const [state, action, isPending] = useActionState(loginAction, {
        signal: abortControllerRef.current.signal,
        success: false,
    });
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            router.push('/');
        }
    }, [router, state.success]);

    useEffect(() => {
        const abortController = abortControllerRef.current;
        return (): void => {
            abortController.abort();
        };
    }, []);

    return <Box>
        <LoginForm
            action={action}
            isPending={isPending}
            success={state.success}
        />
        <LoginFormAlert {...state} />
    </Box>;
};
