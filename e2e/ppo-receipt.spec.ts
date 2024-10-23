import { test, expect } from './fixtures';

test.describe('PPO Receipt', () => {
    test.beforeEach(async ({ page, pensionPage }) => {
        await pensionPage.staticLogin();
        await page.goto('pension-process/ppo/ppo-receipt');
    });

    test('should fill out the form and submit successfully', async ({ pensionPage }) => {
        await pensionPage.savePpoReceipt();
    });

    test('should display error for duplicate PPO number', async ({ page, pensionPage }) => {
        await page.click('button:has-text("PPO Receipt Entry")');

        const inputElement = page.locator('input[formControlName=ppoNo]');
        await inputElement.waitFor({ state: 'visible' });
        await expect(inputElement).not.toBeEmpty();
        const ppoNo = await inputElement.inputValue();

        await page.click('button:has-text("Submit")');
        await pensionPage.okSuccess();
        expect(true).toBeTruthy();

        const inputElement1 = page.locator('input[formControlName=ppoNo]');
        await inputElement1.waitFor({ state: 'visible' });
        await expect(inputElement1).not.toBeEmpty();
        await page.locator('input[formControlName=ppoNo]').fill(ppoNo);

        await page.click('button:has-text("Submit")');
        await pensionPage.okError();
        expect(true).toBeTruthy();
    });

    test('should edit an existing entry', async ({ page, pensionPage }) => {
        await page.click('button:has-text("Load PPO Receipts")');

        await page.waitForSelector('tbody.p-element.p-datatable-tbody', { state: 'attached', timeout: 10000 });
        await page.click('td.ng-star-inserted button:has-text("Edit")');

        await expect(async () => {
            await expect(page.locator('input[formcontrolname="pensionerName"]')).not.toBeEmpty();
          }).toPass({ timeout: 20_000 });
        await page.fill('input[formControlName="pensionerName"]', 'Raj Roy');

        await page.click('button:has-text("Update")');
        await pensionPage.okSuccess();
        expect(true).toBeTruthy();
    });

});
