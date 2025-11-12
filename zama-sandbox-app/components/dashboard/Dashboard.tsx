'use client';

import { ApiKey, ApiKeyExisting, KeyState } from "@/lib/key/key";
import { KeyActionType } from "@/lib/key/key.reducer";
import { getKeysFromStorage } from "@/lib/key/storage";
import { Box, Fab, Typography } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DataGrid } from "./DataGrid";
import AddIcon from '@mui/icons-material/Add';
import { NewKeyModal } from "./NewKeyModal";
import { KeyContext, KeyDispatchContext } from "@/lib/key/context";
import { useRouter } from "next/navigation";

interface Props {
    keys: ApiKeyExisting[];
}

function useKeys(backendKeys: ApiKeyExisting[]): KeyState {
    const dispatch = useContext(KeyDispatchContext);
    const allKeys = useContext(KeyContext);
    
    useEffect(() => {
        const localKeys = getKeysFromStorage(sessionStorage);
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
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const router = useRouter();

    const allKeys = useMemo((): ReadonlyArray<Readonly<ApiKey>> => {
        return Array.from(keyMap.values());
    }, [keyMap]);

    const handleCloseCreateModal = useCallback((): void => {
        setCreateModalOpen(false);
    }, [setCreateModalOpen]);

    const openCreateModal = useCallback((): void => {
        setCreateModalOpen(true);
    }, [setCreateModalOpen]);

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
                onClick={openCreateModal}
            >
                <AddIcon />
            </Fab>
        </Box>
        <NewKeyModal
            open={createModalOpen}
            onClose={handleCloseCreateModal}
        />
    </>;
};
