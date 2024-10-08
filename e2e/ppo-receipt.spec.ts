import { test, expect } from './fixtures';

test.describe('PPO Receipt', () => {
    test.beforeEach(async ({ page, pensionPage }) => {
        await pensionPage.staticLogin();
        await page.goto('/#/pension/modules/pension-process/ppo/receipt');
    });

    test('should fill out the form and submit successfully', async ({ page }) => {
        await page.click('button:has-text("PPO Receipt Entry")');
        await page.click('button:has-text("Submit")');
        const successMessage = page.locator('text=PPO Receipt added successfully');
        await expect(successMessage).toBeVisible();
    });

    test.fixme('should display error for duplicate PPO number', async ({ page }) => {
        await page.click('button:has-text("PPO Receipt Entry")');
        const ppoNo = await page.getByText('PPO-').first().innerText();
        await page.fill('input[formControlName="ppoNo"]', ppoNo);
        await page.click('button:has-text("Submit")');
        const errorMessage = page.locator('small.p-error:has-text("This PPO number already exists. Please use a different PPO number.")');
        await expect(errorMessage).toBeVisible();
    });

    test.fixme('should edit an existing entry', async ({ page }) => {
        await page.waitForSelector('tbody.p-element.p-datatable-tbody', { state: 'attached', timeout: 10000 });
        await page.click('td.ng-star-inserted button:has-text("Edit")');
        await page.fill('input[formControlName="pensionerName"]', 'Raj Roy');
        await page.click('button:has-text("Update")');
        const successMessage = page.locator('text=PPO Receipt added successfully');
        await expect(successMessage).toBeVisible();
    });

});
