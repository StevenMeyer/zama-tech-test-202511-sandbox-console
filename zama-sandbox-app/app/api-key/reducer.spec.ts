import { v4 } from "../utils/uuid";
import { ApiKeyBuilder } from "./apiKey.builder";
import { ApiKey } from "./apiKey";
import { ActionType, apiKeysReducer, ApiKeysState, defaultState } from "./reducer";
import { IApiKeyExisting } from "./apiKey.types";

describe('API keys reducer', function (): void {
    beforeEach(function (): void {
        jest.useFakeTimers({
            now: new Date('2025-11-01T09:30:00.000Z'),
        });
    });

    afterAll(function (): void {
        jest.useRealTimers();
    });

    it('creates an unsaved API key for the CreateNewKey action', function (): void {
        const state = apiKeysReducer(defaultState, {
            type: ActionType.CreateNewKey,
            payload: {
                name: 'My API Key',
            },
        });
        expect(state).toEqual({
            apiKeys: expect.any(Map),
        });
        expect(state.apiKeys.size).toBe(1);
        const model = state.apiKeys.values().next().value!;
        expect(model).toMatchObject({
            id: expect.any(String),
            name: 'My API Key',
            maskedKey: '********-****-****-****-************',
            createdAt: new Date('2025-11-01T09:30:00.000Z'),
            isRevoked: false,
        });
        expect(model.key).toBeUndefined();
        expect(model.hasUnseenKey).toBe(false);
        expect(model.isExpired).toBe(false);
        expect(model.isConfirmedCreated).toBe(false)
    
        jest.advanceTimersByTime(5001);
        const state2 = apiKeysReducer(state, {
            type: ActionType.CreateNewKey,
            payload: {
                name: 'My second API key',
            },
        });
        expect(state2.apiKeys.size).toBe(2);
        const models = Array.from(state2.apiKeys.values());
        expect(models[1].id).not.toBe(models[0].id);
        expect(models[1]).toMatchObject({
            name: 'My second API key',
            createdAt: new Date('2025-11-01T09:30:05.001Z'),
            isRevoked: false,
        });
    });

    it('adds an existing key for the AddExistingKey action', function(): void {
        const newKey = new ApiKeyBuilder('My pending key already in our state');
        const existingKey = new ApiKeyBuilder('My key already in our state')
            .withCreatedAt('2025-10-14T19:41:59.683Z')
            .withExpiresAt('2026-01-15T00:00:00.000Z');
        const initialState: ApiKeysState = {
            apiKeys: new Map([
                newKey.buildMapEntry('buildUnconfirmedModel'),
                existingKey.buildMapEntry('buildModel'),
            ]),
        };

        const nextState = apiKeysReducer(initialState, {
            type: ActionType.AddExistingKey,
            payload: {
                id: '164a7cd4-a081-43e1-856d-2522480e4056',
                name: 'My key to add',
                maskedKey: '********-****-****-****-******de10a8',
                createdAt: '2025-07-25T15:34:44.451Z',
                expiresAt: '2025-10-26T00:00:00.000Z',
                isRevoked: false,
            },
        });
        expect(nextState).toEqual({
            apiKeys: expect.any(Map),
        });
        expect(nextState.apiKeys.size).toBe(3);
        const models = Array.from(nextState.apiKeys.values());
        expect(models[0]).toBe(initialState.apiKeys.get(newKey.unconfirmedModel.id));
        expect(models[1]).toBe(initialState.apiKeys.get(existingKey.id));
        expect(models[2]).toMatchObject({
            id: '164a7cd4-a081-43e1-856d-2522480e4056',
            name: 'My key to add',
            maskedKey: '********-****-****-****-******de10a8',
            createdAt: new Date('2025-07-25T15:34:44.451Z'),
            expiresAt: new Date('2025-10-26T00:00:00.000Z'),
            isRevoked: false,
        });
        expect(models[2].hasUnseenKey).toBe(false);
        expect(models[2].isExpired).toBe(true);
        expect(models[2].isConfirmedCreated).toBe(true);
    });

    it('revokes a key with the RevokeKey action', function (): void {
        const key1 = new ApiKeyBuilder('My first API key')
            .withCreatedAt('2025-10-14T19:41:59.683Z')
            .withExpiresAt('2026-01-15T00:00:00.000Z');
        const key2 = new ApiKeyBuilder('My second API key')
            .withCreatedAt('2025-09-28T07:33:12.483Z')
            .withExpiresAt('2025-12-29T00:00:00.000Z');
        const key3 = new ApiKeyBuilder('My third API key')
            .withCreatedAt('2020-01-01T08:11:52.844Z');
        const initialState: ApiKeysState = {
            apiKeys: new Map([
                key1.buildMapEntry('buildModel'),
                key2.buildMapEntry('buildModel'),
                key3.buildMapEntry('buildModel'),
            ]),
        };
        expect(initialState.apiKeys.get(key2.id)?.isRevoked).toBe(false);

        const nextState = apiKeysReducer(initialState, {
            type: ActionType.RevokeKey,
            payload: {
                id: key2.id,
            },
        });
        expect(nextState.apiKeys.size).toBe(3);
        const models = Array.from(nextState.apiKeys.values());
        expect(models[0]).toBe(initialState.apiKeys.get(key1.id));
        expect(models[1]).toMatchObject({
            id: key2.id,
            name: key2.name,
            maskedKey: key2.maskedKey,
            createdAt: new Date(key2.createdAt),
            expiresAt: new Date(key2.expiresAt!),
            isRevoked: true, // this property changed
        });
        expect(models[2]).toBe(initialState.apiKeys.get(key3.id));
    });

    it('updates the correct model with the ConfirmKey action', function (): void {
        const key1 = new ApiKeyBuilder('Key #1')
            .withCreatedAt('2025-10-31T14:28:11.000Z');
        const key2 = new ApiKeyBuilder('Key #2, just been created so unconfirmed')
            .withCreatedAt('2025-11-01T09:29:00.000Z'); // 1 min ago
        const key3 = new ApiKeyBuilder('Key #3, also unconfirmed')
            .withCreatedAt('2025-11-01T09:29:41.000Z'); // 19 sec ago
        const initialState: ApiKeysState = {
            apiKeys: new Map([
                key1.buildMapEntry('buildModel'),
                key2.buildMapEntry('buildUnconfirmedModel'),
                key3.buildMapEntry('buildUnconfirmedModel'),
            ]),
        };
        const initialModels = Array.from(initialState.apiKeys.values());

        const id = v4();
        const key = v4();
        const nextState = apiKeysReducer(initialState, {
            type: ActionType.ConfirmKey,
            payload: {
                id, // the backend will assign a "real" id
                name: 'Key #2, just been created so unconfirmed',
                appId: initialModels[1].id, // the ID the frontend App assigned
                maskedKey: `********-****-****-****-******${key.substring(key.length - 6)}`,
                key,
                createdAt: '2025-11-01T09:29:33.000Z',
                isRevoked: false,
            },
        });
        expect(nextState.apiKeys.size).toBe(3);
        const models = Array.from(nextState.apiKeys.values());
        expect(models[0]).toBe(initialModels[0]);
        expect(models[2]).toBe(initialModels[2]);
        expect(models[1]).toMatchObject({
            id,
            name: 'Key #2, just been created so unconfirmed',
            key,
            maskedKey: `********-****-****-****-******${key.substring(key.length - 6)}`,
            createdAt: new Date('2025-11-01T09:29:33.000Z'),
            isRevoked: false,
        });
        expect(models[1].hasUnseenKey).toBe(true);
        expect(initialModels[1].hasUnseenKey).toBe(false);
        expect(models[1].isConfirmedCreated).toBe(true);
        expect(initialModels[1].isConfirmedCreated).toBe(false);
    });

    it('populates the keys with the PopulateKeys action', function (): void {
        const key1: IApiKeyExisting = {
            id: v4(),
            name: 'My first API key',
            maskedKey: '********-****-****-****-******38b7dc',
            createdAt: '2025-10-15T10:44:41.523Z',
            updatedAt: '2025-10-15T10:48:02.527Z',
            isRevoked: true,
        };
        const key2: IApiKeyExisting = {
            id: v4(),
            name: 'My second API key',
            maskedKey: '********-****-****-****-******9fee69',
            createdAt: '2025-10-15T10:51:15.933Z',
            isRevoked: false,
        };
        const nextState = apiKeysReducer(defaultState, {
            type: ActionType.PopulateKeys,
            payload: [
                key1,
                key2,
            ],
        });

        expect(nextState.apiKeys.size).toBe(2);
        const models = Array.from(nextState.apiKeys.values());
        expect(models[0]).toMatchObject({
            id: key1.id,
            name: 'My first API key',
            maskedKey: '********-****-****-****-******38b7dc',
            createdAt: new Date('2025-10-15T10:44:41.523Z'),
            updatedAt: new Date('2025-10-15T10:48:02.527Z'),
            isRevoked: true,
        });
        expect(models[1]).toMatchObject({
            id: key2.id,
            name: 'My second API key',
            maskedKey: '********-****-****-****-******9fee69',
            createdAt: new Date('2025-10-15T10:51:15.933Z'),
            isRevoked: false,
        });
    });
});