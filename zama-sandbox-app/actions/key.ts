'use server';
import { verifySession } from "@/lib/dal";
import { NewKeyFormExpiresAtError, NewKeyFormFormError, NewKeyFormNameError, NewKeyFormState } from "@/lib/key/newKeyForm";
import { NewKeyFormActionType, newKeyFormReducer } from "@/lib/key/newKeyForm.reducer";
import { isValidDate } from "@/lib/util/datetime";
import { v4 as uuid } from "uuid";

export async function createKey(state: NewKeyFormState, formData: FormData): Promise<NewKeyFormState> {
    const { isAuth } = await verifySession();
    if (!isAuth) {
        return newKeyFormReducer(state, {
            type: NewKeyFormActionType.setFormError,
            payload: NewKeyFormFormError.notAuthorized,
        });
    }

    const name = formData.get('name');
    const expiresAt = formData.get('expiresAt');
    const neverExpires = formData.get('neverExpires');
    let nextState = state;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        nextState = newKeyFormReducer(nextState, {
            type: NewKeyFormActionType.changeNameValue,
            payload: '',
        });
        nextState = newKeyFormReducer(nextState, {
            type: NewKeyFormActionType.setNameError,
            payload: NewKeyFormNameError.required,
        });
    }

    const isNeverExpires = neverExpires === 'on';
    if (!isNeverExpires) {
        if (!expiresAt || typeof expiresAt !== 'string' || expiresAt.trim() === '') {
            nextState = newKeyFormReducer(nextState, {
                type: NewKeyFormActionType.changeExpiresAtValue,
                payload: '',
            });
            nextState = newKeyFormReducer(nextState, {
                type: NewKeyFormActionType.setFormError,
                payload: NewKeyFormFormError.noExpireOption,
            });
        } else {
            const expiresAtDate = new Date(`${expiresAt}:00.000Z`);
            if (!isValidDate(expiresAtDate) || expiresAtDate <= new Date()) {
                nextState = newKeyFormReducer(nextState, {
                    type: NewKeyFormActionType.setExpiresAtError,
                    payload: NewKeyFormExpiresAtError.valueInPast,
                });
            }
        }
    }

    if (!nextState.ok || !nextState.fields.expiresAt.ok || !nextState.fields.name.ok) {
        return nextState;
    }

    // we would store the key in a database, but this demo has no backend
    const key = uuid();
    return newKeyFormReducer(state, {
        type: NewKeyFormActionType.success,
        payload: {
            id: uuid(),
            name: (name as string),
            key,
            maskedKey: `********-****-****-****-******${key.substring(key.length - 6)}`,
            createdAt: new Date().toISOString(),
            expiresAt: isNeverExpires ? undefined : `${expiresAt}:00.000Z`,
            isRevoked: false,
        },
    });
}
