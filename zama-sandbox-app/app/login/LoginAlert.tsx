import { AlertProps, Collapse, Alert } from "@mui/material";
import { memo } from "react";
import { LoginFormState, ErrorType } from "./reducer";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';

export const LoginFormAlert = memo<LoginFormState>(function LoginFormAlert({ error, success }) {
    const isError = error?.type !== undefined;
    const {message, severity} = ((): { message: string; severity: NonNullable<AlertProps['severity']> } => {
        if (success) {
            return {
                message: 'Logged in successfully.',
                severity: 'success',
            };
        }
        if (error?.type === ErrorType.credentials) {
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
}, function propsAreEqual(prev, next) {
    return prev.success === next.success && prev.error?.type === next.error?.type;
});