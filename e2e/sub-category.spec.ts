import { test, expect } from '@playwright/test';

test.describe('Sub Category', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        // Navigate to the static login page containing user roles
        await page.goto('/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if(isMobile) {
            await page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        await page.goto('/master/sub-category');
    });

    test('Check the input box is visible and working or not and submit it successfully', async ({
        page,
    }) => {
        await page.getByRole('button', { name: 'Load Sub-Caregory Details' }).click();
        await page.getByRole('button', { name: 'New' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'SubCategory saved sucessfully!'
        );
    });


    test('Duplicate Data Checking ', async ({ page }) => {
        await page.getByRole('button', { name: 'Load Sub-Caregory Details' }).click();
        await page.getByRole('button', { name: 'New' }).click();
        const data = await page.locator('input[formControlName=SubCategoryName]').inputValue();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'SubCategory saved sucessfully!'
        );
        await page.getByRole('button', { name: 'OK' }).click();

        await page.getByRole('button', { name: 'New' }).click();
        await page.locator('input[formControlName=SubCategoryName]').fill(data);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Aww! Snap...')).toContainText(
            'Sub Category already exists!'
        );
    });
});
