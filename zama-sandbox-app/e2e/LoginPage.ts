import { Locator, Page } from "@playwright/test";

export class LoginPage {
    readonly alert: Locator;
    readonly idField: Locator;
    readonly passwordField: Locator;
    readonly submitButton: Locator;
    readonly successAlert: Locator;

    constructor(readonly page: Page) {
        this.alert = page.getByRole('alert');
        this.idField = page.getByRole('textbox', {
            name: 'Username or e-mail address',
        });
        this.passwordField = page.getByLabel('Password *');
        this.submitButton = page.getByRole('button', {
            name: 'Login',
        });
        this.successAlert = this.alert.filter({
            hasText: 'Logged in successfully.',
        });
    }

    async fillIdAndPassword(id: string, password: string): Promise<void> {
        await this.idField.fill(id);
        await this.passwordField.fill(password);
    }

    async goto(): Promise<void> {
        await this.page.goto('/login');
    }

    async login(id: string, password: string): Promise<void> {
        await this.fillIdAndPassword(id, password);
        await this.submitButton.click();
    }
}
