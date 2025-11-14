import { NewKeyFormFormError } from "@/lib/key/newKeyForm";
import { Alert, AlertProps, AlertTitle, Button, Collapse, Typography } from "@mui/material";
import Link from "next/link";
import { memo, ReactNode, useCallback, useRef, useState } from "react";
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface Props {
    error?: NewKeyFormFormError;
    keyValue?: string;
    success: boolean;
}

const enum CopyStatus {
    unused,
    error,
    success,
}

export const NewKeyAlert = memo<Props>(({ error, keyValue: key, success }) => {
    const [copyStatus, setCopyStatus] = useState(CopyStatus.unused);

    const badMessage = ((): { message: ReactNode; severity: AlertProps['severity']; } | undefined => {
        if (error === undefined) {
            return;
        }
        if (error === NewKeyFormFormError.noExpireOption) {
            return {
                message: 'You must either set an expiry date or check the "Key never expires" option.',
                severity: 'warning',
            };
        }
        if (error === NewKeyFormFormError.notAuthorized) {
            return {
                message: <>
                    <AlertTitle>You are not logged in.</AlertTitle>
                    <Typography>You should  be redirected to the <Link href="/login">login page</Link> automatically.</Typography>
                    <Typography>If you are not, <Link href="/login">you can click here to log in now</Link>.</Typography>
                </>,
                severity: 'error',
            };
        }
        return {
            message: 'There was a problem creating the key. Please try again.',
            severity: 'warning',
        };
    })();

    const copyToClipBoard = useCallback((): void => {
        if (!key) {
            return;
        }
        navigator.clipboard.writeText(key)
            .then((): void => {
                setCopyStatus(CopyStatus.success);
            }, (): void => {
                setCopyStatus(CopyStatus.error);
            });
    }, [key, navigator.clipboard, setCopyStatus]);

    const iconMapping = useRef<AlertProps['iconMapping']>({
        error: <ErrorIcon fontSize="inherit" />,
        warning: <ErrorIcon fontSize="inherit" />,
        success: <CheckIcon fontSize="inherit" />,
    });

    const successMessage = success ? <>
        <AlertTitle>New API key created</AlertTitle>
        <Typography>The key will only be shown <em>ONCE</em>. Once this form is closed you will not be able to see this key again.</Typography>
        <Typography>Please save this key securely now. Anyone with this key can access the API on your behalf.</Typography>
        <Typography>Your key is <Typography component="code" variant="button">{key}</Typography></Typography>
        <Typography>You may <Link href="/">click here to go back to the dashboard</Link>.</Typography>
    </> : undefined;

    const action = success && key ? (
        <Button
            color="inherit"
            endIcon={copyStatus === CopyStatus.error ? <ErrorIcon fontSize="inherit" /> : <ContentCopyIcon fontSize="inherit" />}
            size="small"
            onClick={copyToClipBoard}
        >{((): string => {
            if (copyStatus === CopyStatus.error) {
                return 'Error copying';
            }
            if (copyStatus === CopyStatus.success) {
                return 'Copied';
            }
            return 'Copy';
        })()}</Button>
    ) : undefined;

    return <Collapse in={error !== undefined || success}>
        <Alert
            action={action}
            iconMapping={iconMapping.current}
            severity={badMessage?.severity ?? 'success'}
        >
            {badMessage?.message}
            {successMessage}
        </Alert>
    </Collapse>;
});
