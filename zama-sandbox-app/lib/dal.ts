import 'server-only';
import { cookies } from "next/headers";
import { cache } from "react";
import { sessionCookieName } from './session/session';
import { ApiKeyExisting } from './key/key';
import demoKeys from '@/demo-data/keys.json';
import demoAnalytics from '@/demo-data/analytics.json';
import { ApiKeyAnalytics } from './key/analytics';

export const verifySession = cache((async (): Promise<{ isAuth: boolean }> => {
    const cookieStore = await cookies();
    if (cookieStore.get(sessionCookieName)) {
        return {
            isAuth: true,
        }
    }
    return {
        isAuth: false,
    };
}));

export const getKeys = cache(async (): Promise<ApiKeyExisting[]> => {
    const session = await verifySession();
    if (!session.isAuth) {
        return [];
    }
    return [...demoKeys];
});

export const getKey = cache(async (keyId: string): Promise<ApiKeyExisting | void> => {
    const session = await verifySession();
    if (!session.isAuth) {
        return;
    }
    return demoKeys.find(({ id }) => id === keyId);
});

export const getKeyAnalytics = cache(async (keyId: string): Promise<ApiKeyAnalytics | undefined> => {
    const session = await verifySession();
    if (!session.isAuth) {
        return;
    }
    return demoAnalytics.find(({ keyId: analyticsKeyId }) => analyticsKeyId === keyId);
});
