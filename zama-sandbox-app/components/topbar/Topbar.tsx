import Box from "@mui/material/Box";
import { FC, ReactNode } from "react";

interface Item {
    key: string;
    item: ReactNode;
}

interface Props {
    leftItems?: Item[];
    rightItems?: Item[];
}

const ItemContainer: FC<{ items?: Item[] }> = ({ items }) => {
    return <Box sx={{
        alignItems: 'center',
        display: 'flex',
        gap: 2,
        flexFlow: 'row nowrap',
    }}>
        { items?.map(({ key, item }) => {
            return <Box key={key}>{item}</Box>
        }) }
    </Box>
};

export const Topbar: FC<Props> = ({ leftItems, rightItems }) => {
    return <Box sx={{
        alignItems: 'center',
        backgroundColor: 'primary.main',
        display: 'flex',
        gap: 1,
        flexFlow: 'row nowrap',
        height: '100px',
        justifyContent: 'space-between',
        position: 'relative',
        px: 3,
    }}>
        <ItemContainer items={leftItems} />
        <ItemContainer items={rightItems} />
    </Box>;
};
