'use client';
import { Box, Typography } from "@mui/material";
import { FC, useContext, useEffect, useRef } from "react";
import { KeyProperties } from "./KeyProperties";
import { ApiKey, ApiKeyExisting } from "@/lib/key/key";
import { KeyContext, KeyDispatchContext } from "@/lib/key/context";
import { useRouter } from "next/navigation";
import { KeyActionType } from "@/lib/key/key.reducer";
import { RequestCountChart } from "../analytics/RequestCountChart";
import { ApiKeyAnalytics } from "@/lib/key/analytics";

interface Props {
    analytics?: ApiKeyAnalytics;
    apiKey: ApiKeyExisting | string;
}

function useApiKey(thisKey: ApiKeyExisting | string): ApiKey | void {
    const keys = useContext(KeyContext);
    const dispatch = useContext(KeyDispatchContext);
    const key = keys.get(typeof thisKey === 'string' ? thisKey : thisKey.id)
    const router = useRouter();
    const savedKey = useRef(false);

    if (typeof thisKey === 'string') {
        if (!key) {
            router.replace('/');
        }
        return key;
    }

    useEffect((): void => {
        if (!savedKey.current) {
            savedKey.current = true;
            dispatch({
                type: KeyActionType.populateBackendKeys,
                payload: [thisKey],
            });
        }
    }, [dispatch]);

    return key;
}

export const Key: FC<Props> = ({ analytics, apiKey }) => {
    const realApiKey = useApiKey(apiKey);

    if (!realApiKey) {
        return <>Loading...</>;
    }

    return <Box>
        <Box>
            <KeyProperties apiKey={realApiKey} />
        </Box>
        <Box>
            <Typography variant="h2">Analytics</Typography>
            { analytics ? <RequestCountChart data={analytics.requestCounts} /> : <Typography>There is no analytics data for this key.</Typography> }
        </Box>
    </Box>;
};
