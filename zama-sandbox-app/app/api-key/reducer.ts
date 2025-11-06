import { IApiKeyExisting, IApiKeyNew, IApiKeyResponse } from "./apiKey.types";
import { ApiKey } from "./apiKey";

/** Public action types */
export const enum ActionType {
    AddExistingKey,
    CreateNewKey,
    RevokeKey,
    ConfirmKey,
    PopulateKeys,
}

/** Private action; don't export it */
interface SetKeyAction {
    type: 'SetKey',
    payload: ConstructorParameters<typeof ApiKey>,
}

interface AddExistingKeyAction {
    type: ActionType.AddExistingKey,
    payload: IApiKeyResponse;
}

interface CreateNewKeyAction {
    type: ActionType.CreateNewKey;
    payload: IApiKeyNew;
}

interface RevokeKeyAction {
    type: ActionType.RevokeKey,
    payload: Pick<IApiKeyExisting, 'id'>,
}

interface ConfirmKeyAction {
    type: ActionType.ConfirmKey,
    payload: IApiKeyResponse,
}

interface PopulateKeysAction {
    type: ActionType.PopulateKeys,
    payload: Iterable<IApiKeyExisting>;
}

type Actions = AddExistingKeyAction | CreateNewKeyAction | RevokeKeyAction | ConfirmKeyAction | PopulateKeysAction;
type PrivateActions = SetKeyAction;

export interface ApiKeysState {
    apiKeys: Map<string, ApiKey>;
}

export const defaultState: ApiKeysState = {
    apiKeys: new Map(),
};

function reducer(state: ApiKeysState, { type, payload }: Actions | PrivateActions): ApiKeysState {
    if (type === 'SetKey') {
        const vm = new ApiKey(...payload);
        return {
            ...state,
            apiKeys: new Map(state.apiKeys).set(vm.id, vm),
        }
    }
    if (type === ActionType.CreateNewKey) {
        return reducer(state, {
            type: 'SetKey',
            payload: [payload],
        });
    }
    if (type === ActionType.AddExistingKey) {
        return reducer(state, {
            type: 'SetKey',
            payload: [payload],
        });
    }
    if (type === ActionType.RevokeKey) {
        const vm = state.apiKeys.get(payload.id);
        if (!vm || vm.isRevoked) {
            return state;
        }
        return reducer(state, {
            type: 'SetKey',
            payload: [{
                ...vm.toJSON(),
                isRevoked: true,
            }],
        });
    }
    if (type === ActionType.ConfirmKey) {
        if (!payload.appId) {
            return state;
        }
        const model = state.apiKeys.get(payload.appId);
        if (!model) {
            return reducer(state, {
                type: 'SetKey',
                payload: [payload],
            });
        }
        if (model.isConfirmedCreated) {
            return state;
        }

        const entries = Array.from(state.apiKeys.entries());
        const unconfirmedModelPosition = entries.findIndex((entry): boolean => {
            return entry[0] === payload.appId;
        });
        if (unconfirmedModelPosition === -1) {
            // we tested that the key existed, so not finding it is impossible
            // this condition is extremely defensive
            return state;
        }

        entries.splice(unconfirmedModelPosition, 1, [payload.id, new ApiKey(payload)]);
        return {
            ...state,
            apiKeys: new Map(entries),
        };
    }
    if (type === ActionType.PopulateKeys) {
        const apiKeys = new Map<string, ApiKey>();
        for (const seed of payload) {
            apiKeys.set(seed.id, new ApiKey(seed));
        }
        return {
            ...state,
            apiKeys,
        };
    }
    return state;
}

export function apiKeysReducer(state: ApiKeysState, action: Actions): ApiKeysState {
    return reducer(state, action);
}