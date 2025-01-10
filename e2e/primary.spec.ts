import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToPrimaryComponent();
});

test('new button', async ({ page }) => {
    await page.getByRole('button', { name: 'New' }).click();
    const element1 = page.locator('app-popup-table');
    await expect(element1).toBeVisible();
    await element1.click();
    const dialog = page.getByLabel('Search', { exact: true });
    await expect(dialog).toBeVisible();

    const firstRow = dialog.locator('tbody tr:first-child');
    await page.waitForSelector('tbody tr:first-child', { timeout: 500 });
    await firstRow.click();

    await expect(page.getByText('Head Of Account:')).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
});

test('testing the form and submit button', async ({ page, pensionPage }) => {
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

test.skip('duplicate primary category entry ', async ({
    page,
    pensionPage,
}) => {
    await page.getByRole('button', { name: 'New' }).click();

    const inputElement = page.locator(
        'input[getByPlaceholder("-00-000-00-000-V-00-00" as string)]'
    );
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
    const data1 = await inputElement.inputValue();

    const inputElement1 = page.locator(
        'input[formControlName=PrimaryCategoryName]'
    );
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

    const inputElement2 = page.locator(
        'input[getByPlaceholder("-00-000-00-000-V-00-00" as string)]'
    );
    await inputElement2.waitFor({ state: 'visible' });
    await expect(inputElement2).not.toBeEmpty();
    await page
        .locator('input[getByPlaceholder("-00-000-00-000-V-00-00" as string)]')
        .fill(data1);

    const inputElement3 = page.locator(
        'input[formControlName=PrimaryCategoryName]'
    );
    await inputElement3.waitFor({ state: 'visible' });
    await expect(inputElement3).not.toBeEmpty();
    await page
        .locator('input[formControlName=PrimaryCategoryName]')
        .fill(data2);

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okError();
});
