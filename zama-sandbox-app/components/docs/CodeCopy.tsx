'use client';

import { FC, ReactNode, useCallback } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ReactDOMServer from "react-dom/server";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

export const CodeCopy: FC<{ lines: ReactNode[] }> = ({ lines }) => {
    const { palette } = useTheme();
    const copy = useCallback((): void => {
        const text = lines.reduce<string>((accumulator, line, index): string => {
            return `${accumulator}${index > 0 ? '\n' : ''}${ReactDOMServer.renderToString(line).replaceAll('&quot;', '"')}`;
        }, '');
        navigator.clipboard.writeText(text).catch((): void => {});
    }, [lines]);

    return <Box sx={{ border: '1px solid', borderColor: 'secondary.main' }}>
        <Button
            endIcon={<ContentCopyIcon color="inherit" fontSize="inherit" />}
            size="small"
            sx={{ m: 1 }}
            variant="outlined"
            onClick={copy}
        >Copy</Button>
        <ol style={{
            backgroundColor: palette.secondary.main,
            color: palette.secondary.contrastText,
            overflowX: 'scroll',
        }}>
            {lines.map((line, index) => {
                return <li key={index} style={{ whiteSpace: 'nowrap' }}><code>{line}</code></li>;
            })}
        </ol>
    </Box>;
};
