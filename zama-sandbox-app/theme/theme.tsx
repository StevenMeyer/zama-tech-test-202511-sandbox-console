'use client';
import { createTheme } from "@mui/material/styles";
import { FC, PropsWithChildren } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { Link } from "@/components/link/Link";

export const theme = createTheme({
    components: {
        MuiButton: {
            defaultProps: {
                LinkComponent: Link
            },
            styleOverrides: {
                root: {
                    fontSize: '1rem',
                    padding: '0.625rem 1.875rem'
                },
            }
        },
        MuiLink: {
            defaultProps: {
                component: Link
            },
        },
    },
    cssVariables: true,
    palette: {
        primary: {
            main: '#ffd208',
        },
        secondary: {
            main: '#111314',
        },
    },
    typography: {
        fontFamily: 'var(--font-telegraf)',
        h1: {
            fontSize: '3rem',
            fontWeight: '800',
            margin: '1.25rem 0',
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: '800',
            margin: '1.25rem 0',
        },
        h3: {
            fontSize: '2rem',
            fontWeight: '800',
            margin: '1.25rem 0',
        },
        h4: {
            fontSize: '1.8rem',
            fontWeight: '800',
            margin: '1.25rem 0',
        },
        h5: {
            fontSize: '1.6rem',
            fontWeight: '800',
            margin: '1.25rem 0',
        },
        h6: {
            fontSize: '1.1rem',
            fontWeight: '800',
            margin: '1.25rem 0',
        },
        body1: {
            marginBottom: '1.25rem',
        },
        button: {
            fontWeight: '800',
        },
    },
});

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};