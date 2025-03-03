import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.DatabaseSeeder);
    await pensionPage.goToPensionCategory();
});

test('Add Pension Category', async ({ page, pensionPage }) => {
    await expect(
        page.locator('div').filter({ hasText: /^Pension Category Details$/ })
    ).toBeVisible();
    await expect(
        page.getByRole('button', { name: 'New Primary' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'New Primary' }).click();

    const element1 = page.locator('app-popup-table');
    await expect(element1).toBeVisible();
    await element1.click();
    const dialog = page.getByLabel('Search', { exact: true });
    await expect(dialog).toBeVisible();
    const firstRow = dialog.locator('tbody tr:first-child');
    await page.waitForSelector('tbody tr:first-child', {
        timeout: 500,
    });
    await firstRow.click();

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okSuccess();

    await expect(page.getByRole('button', { name: 'New Sub' })).toBeVisible();
    await page.getByRole('button', { name: 'New Sub' }).click();

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okSuccess();

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okSuccess();
});

test('Prevent Duplicate Pension Category Selection', async ({
    page,
    pensionPage,
}) => {
    await expect(page.getByText('Primary Category Name:')).toBeVisible();

    await page.locator('#primary').getByLabel('dropdown trigger').click();
    await page.waitForSelector('p-dropdownitem.p-element', {
        state: 'attached',
        timeout: 5000,
    });
    await page
        .waitForSelector('.ngx-spinner-overlay', {
            state: 'hidden',
            timeout: 8000,
        })
        .catch(() => {});
    await page.locator('p-dropdownitem.p-element').first().click();

    await page.locator('#sub').getByLabel('dropdown trigger').click();
    await page.waitForSelector('p-dropdownitem.p-element', {
        state: 'attached',
        timeout: 5000,
    });
    await page
        .waitForSelector('.ngx-spinner-overlay', {
            state: 'hidden',
            timeout: 8000,
        })
        .catch(() => {});
    await page.locator('p-dropdownitem.p-element').nth(1).click();
    // Submit button interaction
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okError();
});
