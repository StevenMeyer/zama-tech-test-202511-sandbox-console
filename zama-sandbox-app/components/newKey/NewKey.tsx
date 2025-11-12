import { Box, Typography } from "@mui/material";
import { ActionDispatch, FC, FormHTMLAttributes, useEffect, useRef, useState } from "react";
import { NewKeyForm } from "./NewKeyForm";
import { NewKeyAlert } from "./NewKeyAlert";
import { defaultState, NewKeyFormAction, NewKeyFormActionType, newKeyFormReducer } from "@/lib/key/newKeyForm.reducer";
import { useRouter } from "next/navigation";
import { createKey } from "@/actions/key";
import { ApiKeyExisting } from "@/lib/key/key";
import { NewKeyFormFormError } from "@/lib/key/newKeyForm";

interface Props {
    onKeyCreated?(key: ApiKeyExisting): void;
}

export const NewKey: FC<Props> = ({ onKeyCreated }) => {
    const [formState, setFormState] = useState(defaultState);
    const router = useRouter();
    const emittedCreatedEvent = useRef(false);

    if (formState.success && formState.newKey && !emittedCreatedEvent.current) {
        emittedCreatedEvent.current = true;
        const copy = {
            ...formState.newKey,
        };
        delete copy.key;
        onKeyCreated?.(copy);
    }

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
    }, [formState.success]);
    
    return <Box>
        <Typography variant="h1">Create a new API key</Typography>
        <NewKeyForm
            action={action}
            dispatch={dispatch}
            state={formState}
        />
        <NewKeyAlert
            error={formState.error}
            keyValue={formState.newKey?.key}
            success={formState.success}
        />
    </Box>;
};
