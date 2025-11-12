'use client';
import { ActionDispatch, createContext, FC, PropsWithChildren, useReducer } from "react";
import { defaultState, SessionAction, sessionReducer } from "./session.reducer";
import { SessionState } from "./session.types";

export const SessionContext = createContext<SessionState>(defaultState);
export const SessionDispatchContext = createContext<ActionDispatch<[SessionAction]>>((): void => {});

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(sessionReducer, defaultState);
    return <SessionContext value={state}>
        <SessionDispatchContext value={dispatch}>
            {children}
        </SessionDispatchContext>
    </SessionContext>;
};