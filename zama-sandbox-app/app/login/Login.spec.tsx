import '@testing-library/jest-dom';
import { render as libRender, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { Login } from './Login';
import { server } from '../mocks/node';
import { forbidden } from '../mocks/resolvers/api/identity';
import { http, HttpResponse } from 'msw';

function render(...args: Parameters<typeof libRender>): { user: UserEvent } & ReturnType<typeof libRender> {
    return {
        user: userEvent.setup(),
        ...libRender(...args),
    };
}

describe('Login component', function (): void {
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

    it('renders a form', function (): void {
        render(<Login />);

        const idField = getIdField();
        expect(idField).toBeVisible();
        expect(idField).toBeInvalid(); // it's required
        expect(idField).toHaveValue('');

        const passwordField = getPasswordField();
        expect(passwordField).toBeVisible();
        expect(passwordField).toBeInvalid();
        expect(passwordField).toHaveValue('');
        expect(passwordField.getAttribute('type')).toBe('password');

        const submitButton = getSubmitButton();
        expect(submitButton).toBeVisible();

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    describe('submit', function (): void {
        beforeAll(function (): void {
            server.listen();
        });

        afterEach(function (): void {
            server.resetHandlers();
            sessionStorage.clear();
        });

        afterAll(function (): void {
            server.close();
        });

        it('shows a success message with valid credentials', async function (): Promise<void> {
            const { user } = render(<Login />);
            const idField = getIdField();
            const passwordField = getPasswordField();
            const submitButton = getSubmitButton();

            expect(sessionStorage.getItem('token')).toBeNull();

            await user.type(idField, 'joe@example.com');
            await user.type(passwordField, 'password1');
            await user.click(submitButton);
            const alert = await screen.findByRole('alert');
            expect(alert).toHaveTextContent('Logged in successfully.');
            expect(sessionStorage.getItem('token')).not.toBeNull();
        });

        it('does not submit an empty form', async function (): Promise<void> {
            const { user } = render(<Login />);
            const submitButton = getSubmitButton();
            await user.click(submitButton);
            const alert = await screen.findByRole('alert');
            expect(alert).toHaveTextContent('Invalid username/e-mail address or password.');
            expect(sessionStorage.getItem('token')).toBeNull();
        });

        it('shows an alert for invalid credentials', async function (): Promise<void> {
            const { user } = render(<Login />);
            server.use(
                http.post('/api/identity', forbidden()),
            );
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
            const { user } = render(<Login />);
            server.use(
                http.post('/api/identity', () => new HttpResponse(null, {
                    status: 500,
                })),
            );
            const idField = getIdField();
            const passwordField = getPasswordField();
            const submitButton = getSubmitButton();

            await user.type(idField, 'good@example.com');
            await user.type(passwordField, 'correct password');
            await user.click(submitButton);

            const alert = await screen.findByRole('alert');
            expect(alert).toHaveTextContent('There was a problem loggin in. Please try again.');
        });
    });
});
