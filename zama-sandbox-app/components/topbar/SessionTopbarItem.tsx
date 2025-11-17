'use client';
import { SessionContext } from "@/lib/session/context";
import { Box, Button, Typography } from "@mui/material";
import { FC, memo, useContext } from "react";
import LoginIcon from "@mui/icons-material/Login";
import FaceIcon from "@mui/icons-material/Face";

interface Props {}

export const SessionTopbarItem: FC<Props> = memo(() => {
    const { displayName, isAuthorized } = useContext(SessionContext);
    console.log('session', isAuthorized, displayName);
    
    if (!isAuthorized) {
        return <Button
            color="secondary"
            endIcon={<LoginIcon fontSize="inherit" />}
            href="/login"
        >Log in</Button>;
    }

    return <Box>
        <Typography sx={{ mb: 0 }}>
            <FaceIcon color="inherit" fontSize="inherit" sx={{ mr: 1 }} />
            { displayName }
        </Typography>
    </Box>;
});
