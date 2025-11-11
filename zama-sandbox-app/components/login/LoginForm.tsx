import { LoginFormIdError, LoginFormPasswordError, LoginFormState } from "@/lib/login/loginForm";
import { Button, TextField, TextFieldProps } from "@mui/material";
import { ActionDispatch, FC, FormHTMLAttributes, memo, ReactNode, useCallback } from "react";
import { LoginFormAction, LoginFormActionType } from "../../lib/login/loginForm.reducer";

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
        <Id {...state.fields.id} onChange={handleIdChange} />
        <Password {...state.fields.password} onChange={handlePasswordChange} />
        <Button
            disabled={state.fields.submit.disabled}
            loading={state.fields.submit.loading}
            loadingPosition="end"
            size="large"
            type="submit"
            variant="outlined"
        >Login</Button>
    </form>
};
