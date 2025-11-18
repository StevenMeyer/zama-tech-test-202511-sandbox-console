import { LoginPage } from "./page-object-models/LoginPage";
import { expect, test } from "@playwright/test";
import { DashboardPage } from "./page-object-models/DashboardPage";
import demoKeys from "@/demo-data/keys.json";
import { CreateKeyPage } from "./page-object-models/CreateKeyPage";
import { KeyPage } from "./page-object-models/KeyPage";

test('create a new API key', async function ({ page }): Promise<void> {
    await page.clock.setFixedTime('2025-11-01T09:30:00.000');
    const dashboardPage = new DashboardPage(page);
    const loginPage = new LoginPage(page);
    const newKeyPage = new CreateKeyPage(page);
    const existingKeyPage = new KeyPage(page);

    await test.step('Login', async function (): Promise<void> {
        await loginPage.goto();
        await loginPage.isLoginPage();
        await expect(loginPage.alert).toBeEmpty();
        await loginPage.login('test@example.com', 'password1');
    });

    await test.step('View dashboard', async function (): Promise<void> {
        await dashboardPage.goto(); // don't hang around for the redirect
        await dashboardPage.isDashboardPage();
        // Table header also counts as a row!
        await expect(dashboardPage.row).toHaveCount(demoKeys.length + 1);
    });

    await test.step('Create a new key without an expiry date', async function (): Promise<void> {
        await dashboardPage.fab.click();

        await newKeyPage.isCreateKeyPage();
        await newKeyPage.createForeverKey('My new forever key');
    });

    await test.step('First new key was added', async function (): Promise<void> {
        await dashboardPage.goto(); // don't hang around for the redirect
        await expect(dashboardPage.row).toHaveCount(demoKeys.length + 2);
        await expect(dashboardPage.getRow('My new forever key').filter({
            has: page.getByRole('gridcell', {
                name: 'Never',
            }),
        })).toBeVisible();
    });

    await test.step('Create a new key with an expiry date', async function (): Promise<void> {
        await dashboardPage.fab.click();

        await newKeyPage.isCreateKeyPage();
        await newKeyPage.createExpiringKey('My new expiring key', '2025-12-02T00:00');
    });

    await test.step('Second new key was added', async function (): Promise<void> {
        await dashboardPage.goto(); // don't hang around for the redirect
        await expect(dashboardPage.row).toHaveCount(demoKeys.length + 3);
        await expect(dashboardPage.getRow('My new expiring key').filter({
            has: page.getByRole('gridcell', {
                name: '2025-12-02 00:00',
            }),
        })).toBeVisible();
    });

    await test.step('View and revoke key', async function (): Promise<void> {
        await (dashboardPage.getRow(demoKeys[0].name)).click();
        await existingKeyPage.isKeyPage();
        await expect(existingKeyPage.getCardByTitle('Key name').getByRole('cell', {
            name: demoKeys[0].name,
        })).toBeVisible();
        await expect.soft(existingKeyPage.chart).toBeVisible();
        await existingKeyPage.revoke();

        await dashboardPage.goto();
        await expect(dashboardPage.getRow(demoKeys[0].name).filter({
            has: page.getByRole('gridcell', {
                name: 'Revoked',
            }),
        })).toBeVisible();
    });
});