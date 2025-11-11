import { handlers as identityHandlers } from "@/app/mocks/handlers/api/identity";
import { createNetworkFixture, NetworkFixture } from "@msw/playwright";
import testBase from "@playwright/test";

interface Fixtures {
    network: NetworkFixture;
}

export const test = testBase.extend<Fixtures>({
    network: createNetworkFixture({
        initialHandlers: [
            ...identityHandlers,
        ]
    }),
});