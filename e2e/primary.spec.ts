import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToPrimaryComponent();
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.DatabaseSeeder);
});

test('Add New Pension Category', async ({ page, pensionPage }) => {
    await page.getByRole('button', { name: 'New' }).click();

    const element1 = page.locator('app-popup-table');
    await expect(element1).toBeVisible();
    await element1.click();
    const dialog = page.getByLabel('Search', { exact: true });
    await expect(dialog).toBeVisible();
    const firstRow = dialog.locator('tbody tr:first-child');
    await page.waitForSelector('tbody tr:first-child', { timeout: 500 });
    await firstRow.click();

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();

    await pensionPage.okSuccess();
    expect(true).toBeTruthy();
});

test('Prevent Duplicate Primary Category ', async ({ page, pensionPage }) => {
    await page.getByRole('button', { name: 'New' }).click();

    const inputElement = page.locator('input[formControlName=accountHead]');
    await inputElement.waitFor({ state: 'visible' });

    const element1 = page.locator('app-popup-table');
    await expect(element1).toBeVisible();
    await element1.click();
    const dialog = page.getByLabel('Search', { exact: true });
    await expect(dialog).toBeVisible();
    const firstRow = dialog.locator('tbody tr:first-child');
    await page.waitForSelector('tbody tr:first-child', { timeout: 500 });
    await firstRow.click();

    await expect(inputElement).not.toBeEmpty();

    const inputElement1 = page.getByPlaceholder('Description');
    await inputElement1.waitFor({ state: 'visible' });
    await expect(inputElement1).not.toBeEmpty();
    const data2 = await inputElement1.inputValue();

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okSuccess();

    await expect(
        page
            .getByLabel('Primary Category Details')
            .locator('div')
            .filter({ hasText: 'Head Of Account:' })
            .first()
    ).toBeHidden();
    await page.getByRole('button', { name: 'New' }).click();

    const inputElement2 = page.locator('input[formControlName=accountHead]');

    const element2 = page.locator('app-popup-table');
    await expect(element2).toBeVisible();
    await element2.click();
    const dialog2 = page.getByLabel('Search', { exact: true });
    await expect(dialog2).toBeVisible();
    const firstRow2 = dialog2.locator('tbody tr:first-child');
    await page.waitForSelector('tbody tr:first-child', { timeout: 500 });
    await firstRow2.click();

    await inputElement2.waitFor({ state: 'visible' });
    await expect(inputElement2).not.toBeEmpty();

    const inputElement3 = page.getByPlaceholder('Description');
    await inputElement3.waitFor({ state: 'visible' });
    await expect(inputElement3).not.toBeEmpty();
    await page.getByPlaceholder('Description').fill(data2);

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okError();
});
