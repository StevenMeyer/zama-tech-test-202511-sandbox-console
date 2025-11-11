'use client';

import { ApiKey, ApiKeyExisting, KeyState } from "@/lib/key/key";
import { defaultState, KeyActionType, keyReducer } from "@/lib/key/key.reducer";
import { getKeysFromStorage } from "@/lib/key/storage";
import { Box, Typography } from "@mui/material";
import { FC, useEffect, useMemo, useReducer } from "react";
import { DataGrid } from "./DataGrid";

interface Props {
    keys: ApiKeyExisting[];
}

export const Dashboard: FC<Props> = ({ keys }) => {
    const [state, dispatch] = useReducer(keyReducer, defaultState);

    const allKeys = useMemo((): ReadonlyArray<Readonly<ApiKey>> => {
        return Array.from(state.values());
    }, [state]);

    useEffect((): void => {
        const storedKeys = getKeysFromStorage(sessionStorage);
        dispatch({
            type: KeyActionType.populateLocalKeys,
            payload: storedKeys,
        });
        dispatch({
            type: KeyActionType.populateBackendKeys,
            payload: keys,
        });
    }, []);

    return <Box>
        <Box>
            <Typography variant="h1">API keys</Typography>
            <Typography variant="body1">Manage your API keys, here.</Typography>
        </Box>
        <Box>
            <DataGrid
                keys={allKeys}
            />
        </Box>
    </Box>;
};
