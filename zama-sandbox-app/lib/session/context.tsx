'use client';
import { ActionDispatch, createContext, FC, PropsWithChildren, useEffect, useReducer } from "react";
import { defaultState, SessionAction, SessionActionType, sessionReducer } from "./session.reducer";
import { SessionState } from "./session.types";
import { getStateFromStorage, serializeStateToStorage } from "../util/storage";

export const SessionContext = createContext<SessionState>(defaultState);
export const SessionDispatchContext = createContext<ActionDispatch<[SessionAction]>>((): void => {});

export const SessionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(sessionReducer, defaultState);

    useEffect((): void => {
        const localState = getStateFromStorage('sessionData', localStorage);
        if (!localState) {
            return;
        }
        dispatch({
            type: SessionActionType.create,
            payload: localState,
        });
    }, []);

    useEffect((): void => {
        serializeStateToStorage(state, 'sessionData', localStorage);
    }, [state]);
    return <SessionContext value={state}>
        <SessionDispatchContext value={dispatch}>
            {children}
        </SessionDispatchContext>
    </SessionContext>;
};