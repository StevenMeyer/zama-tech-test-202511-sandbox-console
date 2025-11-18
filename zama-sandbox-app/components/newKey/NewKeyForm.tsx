'use client';
import { NewKeyFormExpiresAtError, NewKeyFormNameError, NewKeyFormState } from "@/lib/key/newKeyForm";
import { defaultState, NewKeyFormAction, NewKeyFormActionType } from "@/lib/key/newKeyForm.reducer";
import { getDateTimeUTC } from "@/lib/util/datetime";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { ActionDispatch, FC, FormHTMLAttributes, memo, ReactNode, useCallback, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";

interface Props {
    action?: FormHTMLAttributes<HTMLFormElement>['action'];
    dispatch?: ActionDispatch<[NewKeyFormAction]>;
    state?: NewKeyFormState;
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
        fullWidth
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
        fullWidth
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

export const NewKeyForm: FC<Props> = ({ action = () => {}, dispatch = () => {}, state = defaultState }) => {
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
        <Grid
            container
            spacing={2.5}
        >
            <Grid size={{ xs: 12, sm: 6, md: 5 }}>
                <Name
                    {...state.fields.name}
                    onChange={handleNameChange}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <ExpiresAt
                    {...state.fields.expiresAt}
                    neverExpires={state.fields.neverExpires.value}
                    onChange={handleExpiresAtChange}
                />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
                <NeverExpires
                    {...state.fields.neverExpires}
                    onChange={handleNeverExpiresChange}
                />
            </Grid>
            <Grid size={12}>
                <Button
                    {...state.fields.submit}
                    endIcon={<AddIcon />}
                    loadingPosition="end"
                    type="submit"
                    variant="contained"
                >Create</Button>
            </Grid>
        </Grid>
    </form>
};
