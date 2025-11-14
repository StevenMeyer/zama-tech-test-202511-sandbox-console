/** @jsxImportSource @emotion/react */
'use client';

import { Box, BoxProps } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import { css } from '@emotion/react';

interface Props {
    description: string;
    scale?: number;
}

export const Example: FC<PropsWithChildren<Props>> = ({ children, description, scale = 1 }) => {
    return <Box
        aria-description={description}
        role="presentation"
        sx={{
            position: 'relative',
        }}
    >
        <Box css={css`
            bottom: 0;
            content: "";
            display: block;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 1060;
        `} />
        <Box
            inert
            sx={{ transform: `translateX(${(1 - scale) / 2 * -100}%)` }}
        >
            <Box sx={{
                scale
            }}>
                {children}
            </Box>
        </Box>
    </Box>;
};
