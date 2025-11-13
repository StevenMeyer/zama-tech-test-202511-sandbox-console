import { Locator, Page, expect } from "@playwright/test";

/** Dashbord component Page Object Model */
export class DashboardPage {
    readonly fab: Locator;
    readonly row: Locator;

    constructor(readonly page: Page) {
        this.fab = page.getByRole('button', {
            name: 'Create a new API key',
        });
        this.row = page.getByRole('row');
    }

    /** Get a row in the DataGrid by the key's name. */
    getRow(keyName: string): Locator {
        return this.row.filter({
            has: this.page.getByRole('gridcell', {
                name: keyName
            }),
        });
    }

    async goto(): Promise<void> {
        await this.page.goto('/');
    }

    async isDashboardPage(): Promise<void> {
        await expect(this.page.getByRole('heading', {
            level: 1,
        })).toHaveText('API keys');
    }
}