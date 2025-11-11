import { LoginPage } from './LoginPage';
import { test } from './playwright.setup';
import { expect } from '@playwright/test';
import { SandboxPage } from './SandboxPage';

test('create a new API key', async function ({ page }): Promise<void> {
    await page.clock.setFixedTime('2025-11-01T09:30:00.000');

    await test.step('Login', async function (): Promise<void> {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await expect(page.getByRole('heading', {
            level: 1,
        })).toHaveText('Login');
        await expect(loginPage.alert).toBeEmpty();

        await loginPage.login('test@example.com', 'password1');
        await expect(loginPage.successAlert).toBeVisible();
        await expect(loginPage.successAlert).toHaveText('Logged in successfully.');
    });

    await test.step('Open new key form', async function (): Promise<void> {
        const sandboxPage = new SandboxPage(page);
        await expect(page.getByRole('heading', {
            level: 1,
        })).toHaveText('API keys');
        const createKeyPage = await sandboxPage.openCreateKeyDialog();
        await createKeyPage.createExpiringKey('My new key', '2025-12-01T09:00');
        await expect(createKeyPage.successAlert).toBeVisible();
    });
});