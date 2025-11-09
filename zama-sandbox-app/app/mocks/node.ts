import { setupServer } from "msw/node";
import { handlers as indentityHandlers } from "./handlers/api/identity";

export const server = setupServer(
    ...indentityHandlers,
);