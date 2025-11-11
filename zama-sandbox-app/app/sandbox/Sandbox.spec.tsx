import { render as libRender, screen } from "@testing-library/react";
import { server } from "../mocks/node";
import { Sandbox } from "./Sandbox";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { successWithoutFormData } from "../mocks/resolvers/api/identity";
import { http } from "msw";

jest.mock('next/navigation', function () {
    const push = jest.fn<void, [string]>();
    return {
        useRouter() {
            return {
                push,
            };
        },
    };
});

function render(...args: Parameters<typeof libRender>): { user: UserEvent } & ReturnType<typeof libRender> {
    return {
        user: userEvent.setup(),
        ...libRender(...args),
    };
}

describe('Sandbox component', function (): void {
    beforeAll(function (): void {
        server.listen();
    });

    afterEach(function (): void {
        server.resetHandlers();
    });

    afterAll(function (): void {
        server.close();
    });

    fit('fetches and show the existing API keys', async function (): Promise<void> {
        server.use(
            http.post('/api/identity', successWithoutFormData()),
        );
        await(fetch('api/identity', {
            method: 'POST',
        }))
        render(<Sandbox />);
        await Promise.all([
            screen.findByRole('gridcell', {
                name: 'Node key',
            }),
            screen.findByRole('gridcell', {
                name: 'Key for Xmas contractors'
            }),
            screen.findByRole('gridcell', {
                name: 'James\'s API key',
            }),
        ]);
    });
});