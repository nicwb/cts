import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
  await pensionPage.staticLogin();
  await pensionPage.goToPrimaryComponent();
});

    test('new button', async ({ page }) => {
        await page.getByRole('button', { name: 'New' }).click();

        await expect(page.getByText('Head Of Account:(Major-')).toBeVisible();
        await expect(page.getByText('Description:')).toBeVisible();
    });

    test('testing the form and submit button', async ({ page, pensionPage }) => {
        await page.getByRole('button', { name: 'New' }).click();

        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();

        await pensionPage.okSuccess();
        expect(true).toBeTruthy();
    });


    test('duplicate primary category entry ', async ({ page, pensionPage }) => {
        await page.getByRole('button', { name: 'New' }).click();

        const inputElement = page.locator('input[formControlName=HoaId]');
        await inputElement.waitFor({ state: 'visible' });
        await expect(inputElement).not.toBeEmpty();
        const data1 = await inputElement.inputValue();

        const inputElement1 = page.locator('input[formControlName=PrimaryCategoryName]');
        await inputElement1.waitFor({ state: 'visible' });
        await expect(inputElement1).not.toBeEmpty();
        const data2 = await inputElement1.inputValue();

        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await pensionPage.okSuccess();

        await expect(page.getByLabel('Primary Category Details').locator('div').filter({ hasText: 'Head Of Account:(Major-' }).first()).toBeHidden();
        await page.getByRole('button', { name: 'New' }).click();

        const inputElement2 = page.locator('input[formControlName=HoaId]');
        await inputElement2.waitFor({ state: 'visible' });
        await expect(inputElement2).not.toBeEmpty();
        await page.locator('input[formControlName=HoaId]').fill(data1);

        const inputElement3 = page.locator('input[formControlName=PrimaryCategoryName]');
        await inputElement3.waitFor({ state: 'visible' });
        await expect(inputElement3).not.toBeEmpty();
        await page.locator('input[formControlName=PrimaryCategoryName]').fill(data2);

        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await pensionPage.okError();
    });



