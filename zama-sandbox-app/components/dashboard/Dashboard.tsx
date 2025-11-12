'use client';

import { ApiKey, ApiKeyExisting } from "@/lib/key/key";
import { defaultState, KeyActionType, keyReducer } from "@/lib/key/key.reducer";
import { getKeysFromStorage, serializeStateToStorage } from "@/lib/key/storage";
import { Box, Fab, Typography } from "@mui/material";
import { FC, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { DataGrid } from "./DataGrid";
import AddIcon from '@mui/icons-material/Add';
import { NewKeyModal } from "./NewKeyModal";

interface Props {
    keys: ApiKeyExisting[];
}

export const Dashboard: FC<Props> = ({ keys }) => {
    const [state, dispatch] = useReducer(keyReducer, defaultState);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const createdKeyRef = useRef<ApiKeyExisting>(undefined);

    const allKeys = useMemo((): ReadonlyArray<Readonly<ApiKey>> => {
        return Array.from(state.values());
    }, [state]);

    const handleCloseCreateModal = useCallback((): void => {
        setCreateModalOpen(false);
        if (createdKeyRef.current) {
            dispatch({
                type: KeyActionType.populateBackendKeys,
                payload: [createdKeyRef.current],
            });
            createdKeyRef.current = undefined;
        }
    }, [setCreateModalOpen]);

    const openCreateModal = useCallback((): void => {
        setCreateModalOpen(true);
    }, [setCreateModalOpen]);

    const handleNewKeyCreated = useCallback((newKey: ApiKeyExisting): void => {
        createdKeyRef.current = newKey;
    }, []);

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

    useEffect(() => {
        serializeStateToStorage(state, sessionStorage);
    }, [state]);

    return <>
        <Box>
            <Box>
                <Typography variant="h1">API keys</Typography>
                <Typography variant="body1">Manage your API keys, here.</Typography>
            </Box>
            <Box>
                <DataGrid
                    keys={allKeys}
                />
            </Box>
            <Fab
                color="primary"
                title="Create a new API key"
                onClick={openCreateModal}
            >
                <AddIcon />
            </Fab>
        </Box>
        <NewKeyModal
            open={createModalOpen}
            onClose={handleCloseCreateModal}
            onKeyCreated={handleNewKeyCreated}
        />
    </>;
};
