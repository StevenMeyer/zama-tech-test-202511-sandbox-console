import { Locator, Page, expect } from "@playwright/test";

/** Login component Page Object Model */
export class LoginPage {
    readonly alert: Locator;
    readonly badCredentialsAlert: Locator;
    readonly idField: Locator;
    readonly otherAlert: Locator;
    readonly passwordField: Locator;
    readonly submitButton: Locator;
    readonly successAlert: Locator;

    constructor(readonly page: Page) {
        this.alert = page.getByRole('alert');
        this.badCredentialsAlert = this.alert.filter({
            hasText: 'Invalid username/e-mail address or password.',
        });
        this.idField = page.getByRole('textbox', {
            name: 'Username or e-mail address',
        });
        this.otherAlert = this.alert.filter({
            hasText: 'There was a problem logging in. Please try again.',
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

    async isLoginPage(): Promise<void> {
        await expect(this.page.getByRole('heading', {
            level: 1,
        })).toHaveText('Log in');
    }

    async login(id: string, password: string): Promise<void> {
        await this.fillIdAndPassword(id, password);
        await this.submitButton.click();
        await expect(this.successAlert).toBeVisible();
    }
}
