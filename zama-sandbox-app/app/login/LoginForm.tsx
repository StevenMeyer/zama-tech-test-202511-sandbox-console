import { Alert, AlertProps, Box, Button, Collapse, TextField, Typography } from "@mui/material"
import { FC, memo, useActionState } from "react";
import { ErrorType, LoginFormState } from "./reducer";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';

interface Props {
    signal: AbortSignal;
    submitAction(state: LoginFormState, formDate: FormData): LoginFormState | Promise<LoginFormState>;
}

const LoginFormAlert = memo<LoginFormState>(function LoginFormAlert({ error, success }) {
    const isError = error?.type !== undefined;
    const {message, severity} = ((): { message: string; severity: NonNullable<AlertProps['severity']> } => {
        if (!isError) {
            return {
                message: 'Logged in successfully.',
                severity: 'success',
            };
        }
        if (error.type === ErrorType.credentials) {
            return {
                message: 'Invalid username/e-mail address or password.',
                severity: 'warning',
            };
        }
        return {
            message: 'There was a problem loggin in. Please try again.',
            severity: 'error',
        }
    })();
    return (
        <Collapse in={isError || success}>
            <Alert
                iconMapping={{
                    error: <ErrorIcon fontSize="inherit" />,
                    warning: <ErrorIcon fontSize="inherit" />,
                    success: <CheckIcon fontSize="inherit" />,
                }}
                severity={severity}
            >
                {message}
            </Alert>
        </Collapse>
    );
});

export const LoginForm: FC<Props> = function LoginForm({ signal, submitAction }) {
    const [state, action, isPending] = useActionState(submitAction, {
        signal,
        success: false,
    });
    
    return <Box>
        <form
            noValidate
            action={action}
        >
            <TextField
                required
                label="Username or e-mail address"
                name="id"
            />
            <TextField
                required
                label="Password"
                name="password"
                type="password"
            />
            <Button
                variant="outlined"
                size="large"
                type="submit"
                loading={isPending}
                loadingPosition="end"
                disabled={!!state.success}
            >
                Login
            </Button>
        </form>
        <LoginFormAlert {...state} />
    </Box>;
};
