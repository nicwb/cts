import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToPrimaryComponent();
});

test('Create New Entry Using New Button', async ({ page, pensionPage }) => {
    await page.getByRole('button', { name: 'New' }).click();
    await pensionPage.openPopupAndSelectFirstRow();

    await expect(page.getByText('Head Of Account:')).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
});

test('Submit Primary Component Form Successfully Using New Button', async ({
    page,
    pensionPage,
}) => {
    await page.getByRole('button', { name: 'New' }).click();
    await pensionPage.openPopupAndSelectFirstRow();

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();

    await pensionPage.okSuccess();
    expect(true).toBeTruthy();
});

test('Prevent Duplicate Entry Submission ', async ({ page, pensionPage }) => {
    await page.getByRole('button', { name: 'New' }).click();

    const inputElement = page.locator('input[formControlName=accountHead]');
    await inputElement.waitFor({ state: 'visible' });
    await pensionPage.openPopupAndSelectFirstRow();
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
    await pensionPage.openPopupAndSelectFirstRow();
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
