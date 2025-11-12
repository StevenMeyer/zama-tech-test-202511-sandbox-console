import { NewKeyFormExpiresAtError, NewKeyFormNameError, NewKeyFormState } from "@/lib/key/newKeyForm";
import { NewKeyFormAction, NewKeyFormActionType } from "@/lib/key/newKeyForm.reducer";
import { getDateTimeUTC } from "@/lib/util/datetime";
import { Button, Checkbox, CheckboxProps, FormControlLabel } from "@mui/material";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { ActionDispatch, FC, FormHTMLAttributes, memo, ReactNode, useCallback, useRef } from "react";
import AddIcon from '@mui/icons-material/Add';

interface Props {
    action: FormHTMLAttributes<HTMLFormElement>['action'];
    dispatch: ActionDispatch<[NewKeyFormAction]>;
    state: NewKeyFormState;
}

const Name = memo<NewKeyFormState['fields']['name'] & { onChange(value: string): void }>(({ error, ok, onChange, value }) => {
    const helperText = ((): ReactNode => {
        if (ok) {
            return 'A human-readable name for the API key.';
        }
        if (error === NewKeyFormNameError.required) {
            return 'You must choose a name for this API key.';
        }
    })();

    const handleChange: TextFieldProps['onChange'] = (event): void => {
        onChange(event.target.value);
    };

    return <TextField
        required
        error={!ok}
        helperText={helperText}
        label="Name"
        name="name"
        value={value}
        onChange={handleChange}
    />;
});

const ExpiresAt = memo<NewKeyFormState['fields']['expiresAt'] & { neverExpires: boolean; onChange(value: string): void }>(({ error, neverExpires, ok, onChange, value }) => {
    const minDate = useRef(getDateTimeUTC(new Date()).replace(' ', 'T'));
    
    const helperText = ((): ReactNode => {
        if (ok) {
            return <>The key will stop working on this date (<abbr title="Co-ordinated Universal Time">UTC</abbr>).</>;
        }
        if (error === NewKeyFormExpiresAtError.valueInPast) {
            return <>The expiry date must be in the future (<abbr title="Co-ordinated Universal Time">UTC</abbr>).</>;
        }
    })();

    const handleChange: TextFieldProps['onChange'] = (event): void => {
        onChange(event.target.value);
    };

    return <TextField
        error={!ok}
        helperText={helperText}
        label="Expires at"
        name="expiresAt"
        required={!neverExpires}
        slotProps={{
            htmlInput: {
                min: minDate.current,
            },
            input: {
                readOnly: neverExpires,
            },
        }}
        type="datetime-local"
        value={value}
        onChange={handleChange}
    />;
});

export const NeverExpires = memo<NewKeyFormState['fields']['neverExpires'] & { onChange(checked: boolean): void }>(({ onChange, value }) => {
    const handleChange: CheckboxProps['onChange'] = (_, checked) => {
        onChange(checked);
    };

    return <FormControlLabel
        control={<Checkbox
            checked={value}
            name="neverExpires"
            onChange={handleChange}
        />}
        label="Key never expires"
    />;
});

export const NewKeyForm: FC<Props> = ({ action, dispatch, state }) => {
    const handleNameChange = useCallback((newValue: string): void => {
        dispatch({
            type: NewKeyFormActionType.changeNameValue,
            payload: newValue,
        });
    }, [dispatch]);

    const handleExpiresAtChange = useCallback((newValue: string): void => {
        dispatch({
            type: NewKeyFormActionType.changeExpiresAtValue,
            payload: newValue,
        });
    }, [dispatch]);

    const handleNeverExpiresChange = useCallback((checked: boolean): void => {
        dispatch({
            type: NewKeyFormActionType.changeNeverExpires,
            payload: checked,
        });
    }, [dispatch]);

    return <form
        noValidate
        action={action}
    >
        <Name
            {...state.fields.name}
            onChange={handleNameChange}
        />
        <ExpiresAt
            {...state.fields.expiresAt}
            neverExpires={state.fields.neverExpires.value}
            onChange={handleExpiresAtChange}
        />
        <NeverExpires
            {...state.fields.neverExpires}
            onChange={handleNeverExpiresChange}
        />
        <Button
            {...state.fields.submit}
            endIcon={<AddIcon />}
            loadingPosition="end"
            type="submit"
        >Create</Button>
    </form>
};
