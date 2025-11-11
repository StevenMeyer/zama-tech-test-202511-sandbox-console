// import { Alert, AlertProps, AlertTitle, Button, Collapse, Typography } from "@mui/material";
// import Link from "next/link";
// import { memo, ReactNode, useState } from "react";
// import { CreateKeyState, FormErrorType } from "../sandbox/createKey.action";
// import ErrorIcon from '@mui/icons-material/Error';
// import CheckIcon from '@mui/icons-material/Check';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// interface Props {
//     state: CreateKeyState;
// }

// export const CreateKeyAlert = memo<Props>(function CreateKeyAlert({ state }) {
//     const [copyError, setCopyError] = useState(false);

//     const generalError = ((): { message: ReactNode; severity: AlertProps['severity'] } | undefined => {
//         if (state.error === FormErrorType.NoExpiresAtDateOrNeverExpiresOption) {
//             return {
//                 message: 'You must either set an expiry date or check the "Key never expires" option.',
//                 severity: 'warning',
//             };
//         }
//         if (state.error === FormErrorType.NotAuthorised) {
//             return {
//                 message: <>
//                     <Typography>You are not logged in.</Typography>
//                     <Typography>You should be redirected to the <Link href="/login">login page</Link>.</Typography>
//                 </>,
//                 severity: 'error',
//             };
//         }
//         if (state.error === FormErrorType.Other) {
//             return {
//                 message: 'There was a problem creating the key. Please try again.',
//                 severity: 'warning'
//             };
//         }
//     })();

//     const successMessage = state.createdKey ? <>
//         <AlertTitle>New API key created</AlertTitle>
//         <Typography>An API key <strong>{state.createdKey.name}</strong> was created.</Typography>
//         <Typography>The key will only be shown <em>ONCE</em>. Once this form is closed you will not be able to see this key again.</Typography>
//         <Typography>Please save this key securely now.</Typography>
//         <Typography>Your key is <code>{state.createdKey.key}</code></Typography>
//     </> : undefined;

//     const copyToClipboard = (): void => {
//         if (!state.createdKey?.key) {
//             return;
//         }
//         navigator.clipboard.writeText(state.createdKey.key)
//             .catch((): void => {
//                 setCopyError(true);
//             });
//     };

//     const action = state.createdKey ? (
//         <Button
//             color="inherit"
//             size="small"
//             startIcon={copyError ? <ErrorIcon fontSize="inherit" /> : <ContentCopyIcon fontSize="inherit" />}
//         >{copyError ? 'Error copying' : 'Copy to clipboard'}</Button>
//     ) : undefined;

//     return <Collapse
//         in={!!generalError || !!state.createdKey}
//     >
//         <Alert
//             action={action}
//             iconMapping={{
//                 error: <ErrorIcon fontSize="inherit" />,
//                 warning: <ErrorIcon fontSize="inherit" />,
//                 success: <CheckIcon fontSize="inherit" />,
//             }}
//             severity={generalError?.severity ?? 'success'}
//         >
//             {generalError?.message}
//             {successMessage}
//         </Alert>
//     </Collapse>
// });
