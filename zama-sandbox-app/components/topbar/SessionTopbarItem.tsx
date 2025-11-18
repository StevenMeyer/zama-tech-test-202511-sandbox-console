'use client';
import { SessionContext } from "@/lib/session/context";
import { FC, memo, useContext } from "react";
import LoginIcon from "@mui/icons-material/Login";
import FaceIcon from "@mui/icons-material/Face";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface Props {}

export const SessionTopbarItem: FC<Props> = memo(() => {
    const { displayName, isAuthorized } = useContext(SessionContext);
    
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
