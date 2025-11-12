'use client';
import { ActionDispatch, createContext, FC, PropsWithChildren, useReducer } from "react";
import { KeyState } from "./key";
import { defaultState, KeyAction, keyReducer } from "./key.reducer";

export const KeyContext = createContext<KeyState>(defaultState);
export const KeyDispatchContext = createContext<ActionDispatch<[KeyAction]>>((): void => {});

export const KeyProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(keyReducer, defaultState);
    return <KeyContext value={state}>
        <KeyDispatchContext value={dispatch}>
            {children}
        </KeyDispatchContext>
    </KeyContext>;
};
