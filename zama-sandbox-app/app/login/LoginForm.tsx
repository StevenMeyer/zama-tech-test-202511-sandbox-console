import { Box, Button, TextField } from "@mui/material"
import { FC } from "react";

interface Props {
    action(payload: FormData): void;
    isPending: boolean;
    success: boolean;
}

export const LoginForm: FC<Props> = function LoginForm({ action, isPending, success }) {
    return <Box>
        <form
            noValidate
            action={action}
        >
            <TextField
                required
                label="Username or e-mail address"
                name="id"
            />
            <TextField
                required
                label="Password"
                name="password"
                type="password"
            />
            <Button
                variant="outlined"
                size="large"
                type="submit"
                loading={isPending}
                loadingPosition="end"
                disabled={success}
            >
                Login
            </Button>
        </form>
    </Box>;
};
