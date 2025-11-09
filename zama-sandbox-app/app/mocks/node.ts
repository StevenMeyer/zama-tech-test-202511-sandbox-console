import { setupServer } from "msw/node";
import { handlers as userHandlers } from "./handlers/api/identity";

export const server = setupServer(
    ...userHandlers,
);