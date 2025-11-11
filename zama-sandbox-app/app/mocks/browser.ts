import { setupWorker } from "msw/browser";
import { handlers as identityHandlers } from "./handlers/api/identity";

export const worker = setupWorker(
    ...identityHandlers,
);