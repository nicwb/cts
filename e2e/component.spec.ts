import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
  await pensionPage.staticLogin();
  await pensionPage.goToComponent();
});

    test('Pension component can be saved', async ({ page, pensionPage }) => {
        //ARRANGE
        //ACT
        await page.getByRole('button', { name: 'New Entry' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        //ASSERT
        await pensionPage.okSuccess();
        expect(true).toBeTruthy();
    });

    test('Duplicate data Checking', async ({ page, pensionPage }) => {
        //ARRANGE
        await page.getByRole('button', { name: 'New Entry' }).click();

        const inputElement = page.locator('input[formControlName=componentName]');
        await inputElement.waitFor({ state: 'visible' });
        await expect(inputElement).not.toBeEmpty();
        const data1 = await inputElement.inputValue();

        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await pensionPage.okSuccess();
        expect(true).toBeTruthy();
        //ACT
        await page.getByRole('button', { name: 'New Entry' }).click();

        const inputElement1 = page.locator('input[formControlName=componentName]');
        await inputElement1.waitFor({ state: 'visible' });
        await expect(inputElement1).not.toBeEmpty();

        await page.locator('input[formControlName=componentName]').fill(data1);
        await page.getByRole('button', { name: 'Submit' }).click();
        //ASSERT
        await pensionPage.okError();
        expect(true).toBeTruthy();
    });
