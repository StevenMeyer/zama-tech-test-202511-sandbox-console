import { Locator, Page } from "@playwright/test";
import { CreateKeyPage } from "./CreateKeyPage";

export class SandboxPage {
    readonly fab: Locator;

    constructor(readonly page: Page) {
        this.fab = page.getByRole('button', {
            name: 'Create API key',
        });
    }

    getCreateKeyPage(): CreateKeyPage {
        return new CreateKeyPage(this.page);
    }

    async goto(): Promise<void> {
        await this.page.goto('/');
    }

    async openCreateKeyDialog(): Promise<CreateKeyPage> {
        await this.fab.click();
        return this.getCreateKeyPage();
    }
}
