import { ApiKey, KeyState } from "./key";
import { defaultState, KeyActionType, keyReducer } from "./key.reducer";

export function getKeysFromStorage(storage: Storage): ApiKey[] {
    const serialized = storage?.getItem('keys');
    if (!serialized) {
        return [];
    }
    
    return JSON.parse(serialized);
}

export function serializeStateToStorage(state: KeyState, storage: Storage): boolean {
    if (typeof storage?.setItem?.call !== 'function') {
        return false;
    }
    const keys = Array.from(state.values());
    try {
        storage.setItem('keys', JSON.stringify(keys))
        return true;
    } catch (_) {
        return false;
    }
}