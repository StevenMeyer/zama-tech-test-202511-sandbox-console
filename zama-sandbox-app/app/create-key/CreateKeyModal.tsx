import { Box, Button, Checkbox, FormControlLabel, Modal, ModalProps, TextField, TextFieldProps, Typography } from "@mui/material";
import { FC, useId, useMemo, useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { ExpiresAtErrorType, NameErrorType, type CreateKeyState } from "../sandbox/createKey.action";
import { CreateKeyAlert } from "./CreateKeyAlert";

interface Props extends Pick<ModalProps, 'open' | 'onClose'> {
    action(payload: FormData): void;
    isPending?: boolean;
    state: CreateKeyState;
}

export const CreateKeyModal: FC<Props> = function CreateKeyModal({ action, isPending, open, onClose, state }) {
    const titleId = useId();
    const minDate = useRef(((): string => {
        const now = new Date();
        return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}T${now.getHours()}:${now.getMinutes()}`;
    })());
    const [neverExpires, setNeverExpires] = useState(false);
    const expiresAtSlotProps = useMemo((): TextFieldProps['slotProps'] => ({
        htmlInput: { min: minDate.current },
        input: { readOnly: neverExpires }
    }), [neverExpires]);

    const nameError = ((): string | undefined => {
        if (state.name.error === NameErrorType.required) {
            return 'You must choose a name for the key.';
        }
    })();

    const expiresAtError = ((): string | undefined => {
        if (state.expiresAt.error === ExpiresAtErrorType.tooSmall) {
            return 'The expiry date must be in the future.';
        }
    })();

    return (
        <Modal
            aria-labelledby={titleId}
            open={open}
            onClose={onClose}
        >
            <Box>
                <Typography id={titleId} component="h2" variant="h6">
                    Create a new API key
                </Typography>
                <form action={action} noValidate>
                    <TextField
                        required
                        color={nameError ? 'error' : undefined}
                        label="Key name"
                        name="name"
                        helperText={`A human-readable name for this key.${nameError ? ` ${nameError}` : ''}`}
                    />
                    <TextField
                        aria-readonly={neverExpires}
                        label="Expires at"
                        name="expiresAt"
                        type="datetime-local"
                        helperText={`At this time, the API key will expire and stop working. This is in your local timezone.${expiresAtError ? ` ${expiresAtError}` : undefined}`}
                        slotProps={expiresAtSlotProps}
                    />
                    <FormControlLabel
                        control={<Checkbox
                            checked={neverExpires}
                            name="neverExpires"
                            onChange={(): void => {
                                setNeverExpires(!neverExpires);
                            }}
                        />}
                        label="Key never expires"
                    />
                    <Button
                        disabled={isPending || !!state.createdKey}
                        startIcon={<AddIcon />}
                        type="submit"
                    >Create new API key</Button>
                </form>
                <CreateKeyAlert
                    state={state}
                />
            </Box>
        </Modal>
    );
};