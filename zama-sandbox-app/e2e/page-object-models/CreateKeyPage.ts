import { Locator, Page, expect } from "@playwright/test";

export class CreateKeyPage {
    readonly alert: Locator;
    readonly nameField: Locator;
    readonly expiresAtField: Locator;
    readonly neverExpiresCheckbox: Locator;
    readonly submitButton: Locator;
    readonly successAlert: Locator;

    constructor(readonly page: Page) {
        this.alert = page.getByRole('alert');
        this.nameField = page.getByRole('textbox', {
            name: 'Name',
        });
        this.expiresAtField = page.getByRole('textbox', {
            name: 'Expires at',
        });
        this.neverExpiresCheckbox = page.getByRole('checkbox', {
            name: 'Key never expires',
        });
        this.submitButton = page.getByRole('button', {
            name: 'Create',
        });
        this.successAlert = this.alert.filter({
            hasText: 'New API key created', 
        });
    }

    async createExpiringKey(name: string, expiresAt: string): Promise<void> {
        await this.nameField.fill(name);
        await this.expiresAtField.fill(expiresAt);
        await this.neverExpiresCheckbox.uncheck();
        await this.submitButton.click();
        await expect(this.successAlert).toBeVisible();
    }

    async createForeverKey(name: string): Promise<void> {
        await this.nameField.fill(name);
        await this.neverExpiresCheckbox.check();
        await this.submitButton.click();
        await expect(this.successAlert).toBeVisible();
    }

    async isCreateKeyPage(): Promise<void> {
        await expect(this.page.getByRole('heading', {
            level: 1,
        })).toHaveText('Create a new API key');
    }
}