import '@testing-library/jest-dom';
import { render as libRender, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { Login } from "./Login";
import { LoginFormFormError, LoginFormIdError, LoginFormPasswordError, LoginFormState } from "@/lib/login/loginForm";
import { login } from "@/actions/auth";
import { LoginFormActionType, loginFormReducer } from "@/lib/login/loginForm.reducer";

jest.mock('@/actions/auth', function () {
    const login = jest.fn<Promise<LoginFormState>, [LoginFormState, FormData]>(async (state) => state);
    return {
        login,
    };
});

jest.mock('next/navigation', function () {
    const push = jest.fn<void, [string]>();
    return {
        useRouter() {
            return {
                push,
                replace: push, // same mock so it doesn't matter which method we use
            };
        },
    };
});

describe('Login component', function (): void {
    function render(...args: Parameters<typeof libRender>): { user: UserEvent } & ReturnType<typeof libRender> {
        return {
            user: userEvent.setup(),
            ...libRender(...args),
        };
    }

    function getIdField(): HTMLInputElement {
        return screen.getByRole('textbox', {
            name: 'Username or e-mail address',
        });
    }

    function getPasswordField(): HTMLInputElement {
        // Password fields don't have textbox role
        return screen.getByLabelText('Password *');
    }

    function getSubmitButton(): HTMLButtonElement {
        return screen.getByRole('button', {
            name: 'Login',
        });
    }

    it('renders an empty form', function(): void {
        render(<Login />);

        const idField = getIdField();
        expect(idField).toBeVisible();
        expect(idField).toBeInvalid(); // it's required
        expect(idField).toHaveValue('');
        expect(idField).not.toHaveAccessibleDescription();

        const passwordField = getPasswordField();
        expect(passwordField).toBeVisible();
        expect(passwordField).toBeInvalid();
        expect(passwordField).toHaveValue('');
        expect(passwordField).not.toHaveAccessibleDescription();
        expect(passwordField.getAttribute('type')).toBe('password');

        const submitButton = getSubmitButton();
        expect(submitButton).toBeVisible();

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(login).not.toHaveBeenCalled();
    });

    it('shows a success message with valid credentials', async function (): Promise<void> {
        (login as jest.Mock<Promise<LoginFormState>, [LoginFormState, FormData]>).mockImplementationOnce(async (state) => {
            return loginFormReducer(state, {
                type: LoginFormActionType.success,
            });
        });
        const { user } = render(<Login />);
        const idField = getIdField();
        const passwordField = getPasswordField();
        const submitButton = getSubmitButton();

        await user.type(idField, 'joe@example.com');
        await user.type(passwordField, 'password1');
        await user.click(submitButton);
        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent('Logged in successfully.');
    });

    it('does not submit an empty form', async function (): Promise<void> {
        (login as jest.Mock<Promise<LoginFormState>, [LoginFormState, FormData]>).mockImplementationOnce(async (state) => {
            return loginFormReducer(
                loginFormReducer(state, {
                    type: LoginFormActionType.setIdError,
                    payload: LoginFormIdError.required,
                }),
                {
                    type: LoginFormActionType.setPasswordError,
                    payload: LoginFormPasswordError.required,
                }
            );
        });
        const { user } = render(<Login />);
        const idField = getIdField();
        const passwordField = getPasswordField();
        const submitButton = getSubmitButton();
        await user.click(submitButton);
        expect(idField).toHaveAccessibleDescription('You must enter a username or e-mail address.');
        expect(passwordField).toHaveAccessibleDescription('You must enter a password.');
    });

    it('shows an alert for invalid credentials', async function (): Promise<void> {
        (login as jest.Mock<Promise<LoginFormState>, [LoginFormState, FormData]>).mockImplementationOnce(async (state) => {
            return loginFormReducer(state, {
                type: LoginFormActionType.setFormError,
                payload: LoginFormFormError.badCredentials,
            });
        });
        const { user } = render(<Login />);
        const idField = getIdField();
        const passwordField = getPasswordField();
        const submitButton = getSubmitButton();

        await user.type(idField, 'wrong@example.com');
        await user.type(passwordField, 'bad password');
        await user.click(submitButton);

        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent('Invalid username/e-mail address or password.');
    });

    it('shows an alert for server errors', async function (): Promise<void> {
        (login as jest.Mock<Promise<LoginFormState>, [LoginFormState, FormData]>).mockImplementationOnce(async (state) => {
            return loginFormReducer(state, {
                type: LoginFormActionType.setFormError,
                payload: LoginFormFormError.server,
            });
        });
        const { user } = render(<Login />);
        const idField = getIdField();
        const passwordField = getPasswordField();
        const submitButton = getSubmitButton();

        await user.type(idField, 'wrong@example.com');
        await user.type(passwordField, 'bad password');
        await user.click(submitButton);

        const alert = await screen.findByRole('alert');
        expect(alert).toHaveTextContent('There was a problem logging in. Please try again.');
    });
});
