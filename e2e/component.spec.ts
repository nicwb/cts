import {test,expect} from "@playwright/test";

test.describe('Pension Component Module', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        await expect(page.getByRole('link', { name: 'logo | CTS' })).toBeVisible();
        // Navigate to the page containing your component
        await page.goto('/#/master/app-pension/component');
      });
    
    test('Check the input box is visible or not and submit successfully', async ({ page }) => {
        await page.getByRole('button', { name: 'New Entry' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText("Component Details added successfully");
    });

    test('Duplicate data Checking', async ({ page }) => {
        await page.getByRole('button', { name: 'New Entry' }).click();
        let data1= await page.locator('input[formControlName=componentName]').inputValue();
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText("Component Details added successfully");

        await page.getByRole('button', { name: 'New Entry' }).click();
        await page.locator('input[formControlName=componentName]').fill(data1);
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText("already exists");
    });
});