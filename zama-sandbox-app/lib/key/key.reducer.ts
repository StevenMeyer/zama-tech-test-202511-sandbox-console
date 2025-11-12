import { ApiKey, ApiKeyExisting, KeyState } from "./key";

export const enum KeyActionType {
    populateBackendKeys,
    populateLocalKeys,
    revokeKey,
}

interface PopulateBackendKeysAction {
    type: KeyActionType.populateBackendKeys;
    payload: ApiKeyExisting[];
}

interface PopulateLocalKeysAction {
    type: KeyActionType.populateLocalKeys;
    payload: ApiKey[];
}

interface RevokeKey {
    type: KeyActionType.revokeKey,
    payload: ApiKeyExisting['id'],
}

export type KeyAction =
    | PopulateBackendKeysAction
    | PopulateLocalKeysAction
    | RevokeKey;

export const defaultState: KeyState = new Map();

export function keyReducer(state: KeyState, { type, payload }: KeyAction): KeyState {
    if (type === KeyActionType.populateBackendKeys) {
        const nextState = new Map(state);
        payload.forEach((key): void => {
            const knownKey = state.get(key.id);
            nextState.set(key.id, {
                ...(knownKey ?? key),
                persistedData: key,
            });
        });
        return nextState;
    }

    if (type === KeyActionType.populateLocalKeys) {
        const nextState = new Map<string, ApiKey>();
        payload.forEach((key): void => {
            const knownKey = state.get(key.id);
            nextState.set(key.id, {
                ...key,
                persistedData: {...(knownKey?.persistedData ?? key.persistedData)}
            });
        });
        return nextState;
    }

    if (type === KeyActionType.revokeKey) {
        const key = state.get(payload);
        if (!key || key.isRevoked) {
            return state;
        }
        const nextState = new Map(state);
        nextState.set(key.id, {
            ...key,
            isRevoked: true,
        });
    }

    return state;
}