'use client';

import { ApiKey, ApiKeyExisting, KeyState } from "@/lib/key/key";
import { KeyActionType } from "@/lib/key/key.reducer";
import { getStateFromStorage } from "@/lib/util/storage";
import { Box, Fab, Typography } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useMemo } from "react";
import { DataGrid } from "./DataGrid";
import AddIcon from '@mui/icons-material/Add';
import { KeyContext, KeyDispatchContext } from "@/lib/key/context";
import { useRouter } from "next/navigation";

interface Props {
    keys: ApiKeyExisting[];
}

function useKeys(backendKeys: ApiKeyExisting[]): KeyState {
    const dispatch = useContext(KeyDispatchContext);
    const allKeys = useContext(KeyContext);
    
    useEffect(() => {
        const localKeys = getStateFromStorage('keys', sessionStorage) as ApiKey[];
        dispatch({
            type: KeyActionType.populateLocalKeys,
            payload: localKeys,
        });
        dispatch({
            type: KeyActionType.populateBackendKeys,
            payload: backendKeys,
        });
    }, [backendKeys, dispatch]);

    return allKeys;
}

export const Dashboard: FC<Props> = ({ keys }) => {
    const keyMap = useKeys(keys);
    const router = useRouter();

    const allKeys = useMemo((): ReadonlyArray<Readonly<ApiKey>> => {
        return Array.from(keyMap.values());
    }, [keyMap]);

    const handleFabClick = useCallback((): void => {
        router.push('/key/new');
    }, [router]);

    const handleRowClick = useCallback((key: ApiKeyExisting): void => {
        router.push(`/key/${key.id}`);
    }, []);

    return <>
        <Box>
            <Box>
                <Typography variant="h1">API keys</Typography>
                <Typography variant="body1">Manage your API keys, here.</Typography>
            </Box>
            <Box>
                <DataGrid
                    keys={allKeys}
                    onRowClick={handleRowClick}
                />
            </Box>
            <Fab
                color="primary"
                title="Create a new API key"
                onClick={handleFabClick}
            >
                <AddIcon />
            </Fab>
        </Box>
    </>;
};
