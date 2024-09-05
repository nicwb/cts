import { test, expect } from '@playwright/test';

test.describe('Sub Category', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if(isMobile) {
            page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        await page.goto('/#/master/app-pension/app-sub-category');
    });
    
    test('Check the input box is visible and working or not and submit it successfully', async ({
        page,
    }) => {
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'Sub Category Details added successfully'
        );
    });
    
    
    test('Duplicate Data Checking ', async ({ page }) => {
        await page.getByRole('button', { name: 'New' }).click();
        let data = await page.locator('input[formControlName=SubCategoryName]').inputValue();
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'Sub Category Details added successfully'
        );
        await page.getByRole('button', { name: 'New' }).click();
        await page.locator('input[formControlName=SubCategoryName]').fill(data);
        
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'This already exsists.'
        );
    });
});
