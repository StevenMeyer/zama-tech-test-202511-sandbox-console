import { LoginFormIdError, LoginFormPasswordError, LoginFormState } from "@/lib/login/loginForm";
import { ActionDispatch, FC, FormHTMLAttributes, memo, ReactNode, useCallback } from "react";
import { LoginFormAction, LoginFormActionType } from "../../lib/login/loginForm.reducer";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField, { TextFieldProps } from "@mui/material/TextField";

interface Props {
    action: FormHTMLAttributes<HTMLFormElement>['action'];
    dispatch: ActionDispatch<[LoginFormAction]>;
    state: LoginFormState;
}

const Id = memo<LoginFormState['fields']['id'] & { onChange(value: string): void }>(({ error, ok, onChange, value }) => {
    const helperText = ((): ReactNode => {
        if (ok) {
            return;
        }
        if (error === LoginFormIdError.required) {
            return 'You must enter a username or e-mail address.';
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
        label="Username or e-mail address"
        name="id"
        value={value}
        onChange={handleChange}
    />;
});

const Password = memo<LoginFormState['fields']['password'] & { onChange(value: string): void }>(({ error, ok, onChange, value }) => {
    const helperText = ((): ReactNode => {
        if (ok) {
            return;
        }
        if (error === LoginFormPasswordError.required) {
            return 'You must enter a password.';
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
        label="Password"
        name="password"
        type="password"
        value={value}
        onChange={handleChange}
    />;
});

export const LoginForm: FC<Props> = ({ action, dispatch, state }) => {
    const handleIdChange = useCallback((value: string): void => {
        dispatch({
            type: LoginFormActionType.changeIdValue,
            payload: value,
        });
    }, [dispatch]);

    const handlePasswordChange = useCallback((value: string): void => {
        dispatch({
            type: LoginFormActionType.changePasswordValue,
            payload: value,
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
            <Grid size={{ xs: 12, sm: 6 }}>
                <Id {...state.fields.id} onChange={handleIdChange} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Password {...state.fields.password} onChange={handlePasswordChange} />
            </Grid>
            <Grid size={12}>
                <Button
                    disabled={state.fields.submit.disabled}
                    loading={state.fields.submit.loading}
                    loadingPosition="end"
                    size="large"
                    type="submit"
                    variant="contained"
                >Login</Button>
            </Grid>
        </Grid>
    </form>
};
