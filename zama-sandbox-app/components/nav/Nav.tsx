/** @jsxImportSource @emotion/react */
'use client';
import { Box, Button, Collapse, Divider, Link, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { FC, ReactNode, useContext } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "@/actions/auth";
import { css } from '@emotion/react';
import { SessionContext } from "@/lib/session/context";

interface Props {
    currentRoute?: string;
    isOpen: boolean;
}

const Icon: FC<{ icon: ReactNode; }> = ({ icon }) => {
    return <span style={{
        opacity: 'var(--icon-opacity)',
        transition: 'opacity 100ms ease-in',
    }}>{icon}</span>;
};

const NavListItem: FC<{ currentRoute?: string; route: string; primary: ReactNode; }> = (({ currentRoute, primary, route }) => {
    return <ListItem>
        <ListItemText
            css={css`
                --icon-opacity: 0;
                :hover {
                    --icon-opacity: 1;
                }
            `}
            primary={route === currentRoute ? primary : <>
                <Link color="textPrimary" href={route} underline="none"><strong>{primary}</strong></Link>
                {' '}
                <Icon icon={route.startsWith('http') ? <ArrowOutwardIcon /> : <ArrowForwardIcon />} />
            </>}
        />
    </ListItem>;
});

export const Nav: FC<Props> = ({ currentRoute, isOpen }) => {
    const { isAuthorized } = useContext(SessionContext);
    return <Collapse in={isOpen}>
        <Box
            role="nav"
            sx={{
                bgcolor: 'white',
            }}
        >
            <List dense>
                <NavListItem
                    currentRoute={currentRoute}
                    primary="Dashboard"
                    route="/"
                />
                <NavListItem
                    currentRoute={currentRoute}
                    primary="Create new key"
                    route="/key/new"
                />
                <NavListItem
                    currentRoute={currentRoute}
                    primary="Docs"
                    route="/docs"
                />
                { isAuthorized ? <>
                    <Divider />
                    <ListItem>
                        <ListItemText
                            primary={<Button endIcon={<LogoutIcon />} variant="text" onClick={logout}>Log out</Button>}
                        />
                    </ListItem>
                </> : undefined }
            </List>
        </Box>
    </Collapse>;
};
