"use client";
import { FC, useActionState, useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { KeyGrid } from "../keyGrid/KeyGrid";
import { ApiKey } from "../api-key/apiKey";
import { IApiKeyResponse } from "../api-key/apiKey.types";
import { ActionType, apiKeysReducer, defaultState } from "../api-key/reducer";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { CreateKeyModal } from "../create-key/CreateKeyModal";
import { createKeyAction, CreateKeyState } from "./createKey.action";

async function getKeys(onUnauthorised: (response: Response) => void, onError: (response?: Response) => void): Promise<IApiKeyResponse[]> {
    try {
        const response = await fetch('/api/key');
        if (response.ok) {
            return await response.json();
        }
        if (response.status === 401) {
            onUnauthorised(response);
            return [];
        }
        onError(response);
        return [];
    } catch (_) {
        onError();
        return [];
    }
}

export const Sandbox: FC = function Sandbox() {
    const firstRunRef = useRef(true);
    const abortControllerRef = useRef(new AbortController());
    const [state, dispatch] = useReducer(apiKeysReducer, defaultState);
    const [newKeyModalOpen, setNewKeyModalOpen] = useState(false);
    const router = useRouter();
    
    const [formState, formAction, isPending] = useActionState(createKeyAction, new CreateKeyState(abortControllerRef.current.signal));
    const prevFormState = useRef<typeof formState>(undefined);

    if (formState.createdKey && prevFormState.current?.createdKey !== formState.createdKey) {
        dispatch({
            type: ActionType.AddExistingKey,
            payload: formState.createdKey,
        });
    }
    prevFormState.current = formState;

    if (firstRunRef.current) {
        firstRunRef.current = false;
        getKeys(
            () => {
                router.push('/login');
            },
            () => {},
        ).then((keys) => {
            dispatch({
                type: ActionType.PopulateKeys,
                payload: keys,
            });
        });
    }

    const apiKeys = useMemo((): ApiKey[] => Array.from(state.apiKeys.values()), [state.apiKeys]);

    const openNewKeyModal = useCallback((): void => {
        formState.createdKey = undefined;
        formState.error = undefined;
        formState.expiresAt.error = undefined;
        formState.name.error = undefined;
        setNewKeyModalOpen(true);
    }, [setNewKeyModalOpen]);

    const handleNewKeyModalClose = useCallback((): void => {
        if (prevFormState.current?.createdKey) {
            dispatch({
                type: ActionType.MarkKeySeen,
                payload: prevFormState.current.createdKey,
            });
        }
        setNewKeyModalOpen(false);
    }, [setNewKeyModalOpen]);

    useEffect(() => {
        const abortController = abortControllerRef.current;
        return (): void => {
            abortController.abort();
        };
    }, []);

    return <>
        <Box>
            <KeyGrid apiKeys={apiKeys} />
            <Fab color="primary" title="Create API key" onClick={openNewKeyModal}>
                <AddIcon />
            </Fab>
        </Box>
        <CreateKeyModal
            action={formAction}
            isPending={isPending}
            open={newKeyModalOpen}
            state={formState}
            onClose={handleNewKeyModalClose}
        />
    </>;
}
