import { setupServer } from "msw/node";
import { handlers as indentityHandlers } from "./handlers/api/identity";
import { handlers as apiKeysHandlers } from "./handlers/api/key";

export const server = setupServer(
    ...indentityHandlers,
    ...apiKeysHandlers,
);