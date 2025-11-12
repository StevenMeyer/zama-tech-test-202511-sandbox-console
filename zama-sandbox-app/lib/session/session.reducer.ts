import { SessionState } from "./session.types";


export const enum SessionActionType {
    create,
    destroy,
}

interface SessionCreateAction {
    type: SessionActionType.create;
    payload: Pick<SessionState, 'displayName'>;
}

interface SessionDestroyAction {
    type: SessionActionType.destroy,
    payload?: never;
}

export type SessionAction =
    | SessionCreateAction
    | SessionDestroyAction;

export const defaultState: Readonly<SessionState> = {
    displayName: '',
    isAuthorized: false,
};

export function sessionReducer(state: Readonly<SessionState>, { type, payload }: Readonly<SessionAction>): Readonly<SessionState> {
    switch (type) {
        case SessionActionType.create:
            return {
                ...payload,
                isAuthorized: true,
            };
        case SessionActionType.destroy:
            return {
                displayName: '',
                isAuthorized: false,
            };
        default:
            return state;
    }
}