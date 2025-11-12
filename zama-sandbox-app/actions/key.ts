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

    let nameError: NewKeyFormNameError | undefined;
    let expiresAtError: NewKeyFormExpiresAtError | undefined;
    let formError: NewKeyFormFormError | undefined;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        nameError = NewKeyFormNameError.required;
    }
    const isNeverExpires = neverExpires === 'on';
    if (!isNeverExpires) {
        if (!expiresAt || typeof expiresAt !== 'string' || expiresAt.trim() === '') {
            formError = NewKeyFormFormError.noExpireOption;
        } else {
            const expiresAtDate = new Date(`${expiresAt}:00.000Z`);
            if (!isValidDate(expiresAtDate) || expiresAtDate <= new Date()) {
                expiresAtError = NewKeyFormExpiresAtError.valueInPast;
            }
        }
    }
    if (nameError !== undefined || expiresAtError !== undefined || formError !== undefined) {
        return newKeyFormReducer(
            newKeyFormReducer(
                newKeyFormReducer(state, {
                    type: NewKeyFormActionType.setExpiresAtError,
                    payload: expiresAtError,
                }),
                {
                    type: NewKeyFormActionType.setFormError,
                    payload: formError,
                }
            ),
            {
                type: NewKeyFormActionType.setNameError,
                payload: nameError,
            }
        );
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
            isRevoked: false,
        },
    });
}
