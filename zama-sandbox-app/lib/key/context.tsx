'use client';
import { ActionDispatch, createContext, FC, PropsWithChildren, useEffect, useReducer } from "react";
import { KeyState } from "./key";
import { defaultState, KeyAction, keyReducer } from "./key.reducer";
import { serializeStateToStorage } from "../util/storage";

export const KeyContext = createContext<KeyState>(defaultState);
export const KeyDispatchContext = createContext<ActionDispatch<[KeyAction]>>((): void => {});

export const KeyProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(keyReducer, defaultState);
    useEffect((): void => {
        const keys = Array.from(state.values());
        serializeStateToStorage(keys, 'keys', sessionStorage);
    }, [state]);
    return <KeyContext value={state}>
        <KeyDispatchContext value={dispatch}>
            {children}
        </KeyDispatchContext>
    </KeyContext>;
};
