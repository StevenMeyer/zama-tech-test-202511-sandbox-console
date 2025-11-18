'use client';
import { memo, useCallback, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Nav } from "../nav/Nav";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

interface Props {
    currentRoute: string;
}

export const NavTopbarItem = memo<Props>(({ currentRoute }) => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleClick = useCallback((): void => {
        setIsNavOpen((currentValue) => !currentValue);
    }, [setIsNavOpen]);

    return <>
        <Button
            aria-label="Navigation menu toggle"
            color={isNavOpen ? 'primary' : 'secondary'}
            sx={{
                bgcolor: isNavOpen ? 'text.primary' : undefined,
                color: isNavOpen ? 'text.primary.contrastText' : undefined,
                p: 1,
                minWidth: 3,
            }}
            variant="outlined"
            onClick={handleClick}
        >
            <MenuIcon />
        </Button>
        <Box
            sx={{
                borderBottom: '2px solid black',
                position: 'absolute',
                left: 0,
                top: '100%',
                width: '100%',
                zIndex: 1200,
            }}
        >
            <Nav currentRoute={currentRoute} isOpen={isNavOpen} />
        </Box>
    </>;
});
