'use client';
import { ActionDispatch, FC, FormHTMLAttributes, useContext, useEffect, useRef, useState } from "react";
import { NewKeyForm } from "./NewKeyForm";
import { NewKeyAlert } from "./NewKeyAlert";
import { defaultState, NewKeyFormAction, NewKeyFormActionType, newKeyFormReducer } from "@/lib/key/newKeyForm.reducer";
import { useRouter } from "next/navigation";
import { createKey } from "@/actions/key";
import { ApiKeyExisting } from "@/lib/key/key";
import { NewKeyFormFormError, NewKeyFormState } from "@/lib/key/newKeyForm";
import { KeyDispatchContext } from "@/lib/key/context";
import { KeyActionType } from "@/lib/key/key.reducer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface Props {
    onKeyCreated?(key: ApiKeyExisting): void;
}

function useNewKeyCreated(formState: NewKeyFormState, onKeyCreated: Props['onKeyCreated']): boolean {
    const dispatch = useContext(KeyDispatchContext);
    const dispatched = useRef(false);

    if (formState.success && formState.newKey && !dispatched.current) {
        dispatched.current = true;
        const asExistingKey = {...formState.newKey};
        delete asExistingKey.key;
        dispatch({
            type: KeyActionType.populateBackendKeys,
            payload: [asExistingKey],
        });
        onKeyCreated?.(asExistingKey);
    }
    return dispatched.current;
}

export const NewKey: FC<Props> = ({ onKeyCreated }) => {
    const [formState, setFormState] = useState(defaultState);
    const newKeyCreated = useNewKeyCreated(formState, onKeyCreated);
    const router = useRouter();

    const dispatch: ActionDispatch<[NewKeyFormAction]> = (action) => {
        const nextState = newKeyFormReducer(formState, action);
        if (nextState !== formState) {
            setFormState(nextState);
        }
    };

    const action: FormHTMLAttributes<HTMLFormElement>['action'] = async (formData) => {
        const submitState = newKeyFormReducer(formState, {
            type: NewKeyFormActionType.submit,
        });
        setFormState(submitState);
        const nextState = await createKey(submitState, formData);
        setFormState(nextState);
    };

    useEffect(() => {
        const timeoutId = formState.error === NewKeyFormFormError.notAuthorized ? setTimeout((): void => {
            router.push('/');
        }, 5000) : undefined;
        return (): void => {
            clearTimeout(timeoutId);
        };
    }, [formState.error]);
    
    return <Box>
        <Typography variant="h1">Create a new API key</Typography>
        <NewKeyForm
            action={action}
            dispatch={dispatch}
            state={formState}
        />
        <Box sx={{ mt: 2.5 }}>
            <NewKeyAlert
                error={formState.error}
                keyValue={formState.newKey?.key}
                success={formState.success}
            />
        </Box>
    </Box>;
};
