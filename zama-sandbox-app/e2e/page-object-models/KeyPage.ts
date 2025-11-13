import { Locator, Page, expect } from "@playwright/test";

export class KeyPage {
    readonly card: Locator;
    readonly cards: Locator;
    readonly chart: Locator;
    readonly revokeButton: Locator;

    constructor(readonly page: Page) {
        this.cards = page.getByRole('table', {
            name: 'API key properties',
        });
        this.card = this.cards.getByRole('row');
        this.chart = page.getByRole('img', {
            name: 'Requests made using this API key'
        });
        this.revokeButton = this.getCardByTitle('Revoke').getByRole('button', {
            name: 'Revoke',
        });
    }

    getCardByTitle(propertyName: string): Locator {
        return this.card.filter({
            has: this.page.getByRole('rowheader', {
                name: propertyName,
            }),
        });
    }

    async isKeyPage(): Promise<void> {
        await expect(this.page.getByRole('heading', {
            level: 2,
            name: 'Analytics'
        })).toBeVisible();
    }

    async revoke(): Promise<void> {
        await expect.soft(this.revokeButton).not.toBeDisabled();
        await this.revokeButton.click();
        await expect.soft(this.revokeButton).toBeDisabled();
    }
}