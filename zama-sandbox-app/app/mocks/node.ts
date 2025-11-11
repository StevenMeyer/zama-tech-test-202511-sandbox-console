import { setupServer } from "msw/node";
import { handlers as apiKeysHandlers } from "./handlers/api/key";

export const server = setupServer(
    ...apiKeysHandlers,
);