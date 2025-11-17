'use client';
import { ActionDispatch, createContext, FC, PropsWithChildren, useEffect, useReducer } from "react";
import { defaultState, SessionAction, sessionReducer } from "./session.reducer";
import { SessionState } from "./session.types";
import { getStateFromStorage, serializeStateToStorage } from "../util/storage";

export const SessionContext = createContext<SessionState>(defaultState);
export const SessionDispatchContext = createContext<ActionDispatch<[SessionAction]>>((): void => {});

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(sessionReducer, getStateFromStorage('sessionData', localStorage) as SessionState ?? defaultState);
    useEffect((): void => {
        serializeStateToStorage(state, 'sessionData', localStorage);
    }, [state]);
    return <SessionContext value={state}>
        <SessionDispatchContext value={dispatch}>
            {children}
        </SessionDispatchContext>
    </SessionContext>;
};