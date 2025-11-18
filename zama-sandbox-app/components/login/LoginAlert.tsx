import { LoginFormFormError, LoginFormState } from "@/lib/login/loginForm";
import { FC, memo, ReactNode, useRef } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import CheckIcon from "@mui/icons-material/Check";
import Alert, { AlertProps } from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

interface Props {
    error: LoginFormState['error'];
    success: boolean;
}

export const LoginAlert = memo<Props>(({ error, success }) => {
    const badMessage = ((): { message: ReactNode; severity: NonNullable<AlertProps['severity']> } | undefined => {
        if (error === undefined) {
            return;
        }
        if (error === LoginFormFormError.badCredentials) {
            return {
                message: 'Invalid username/e-mail address or password.',
                severity: 'warning',
            };
        }
        return {
            message: 'There was a problem logging in. Please try again.',
            severity: 'error',
        };
    })();

    const iconMapping = useRef<AlertProps['iconMapping']>({
        error: <ErrorIcon fontSize="inherit" />,
        warning: <ErrorIcon fontSize="inherit" />,
        success: <CheckIcon fontSize="inherit" />,
    });

    return <Collapse in={error !== undefined || success}>
        <Alert
            iconMapping={iconMapping.current}
            severity={badMessage?.severity ?? 'success'}
        >{badMessage?.message ?? 'Logged in successfully.'}</Alert>
    </Collapse>;
});
