export function getStateFromStorage(name: string, storage: Storage): unknown {
    const serialized = storage?.getItem(name);
    if (!serialized) {
        return [];
    }
    
    return JSON.parse(serialized);
}

export function serializeStateToStorage(state: unknown, name: string, storage: Storage): boolean {
    if (typeof storage?.setItem?.call !== 'function') {
        return false;
    }
    try {
        storage.setItem(name, JSON.stringify(state))
        return true;
    } catch (_) {
        return false;
    }
}