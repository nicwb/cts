import { test, expect } from '@playwright/test';

test.describe('Pension Category', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        await page.goto('/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if (isMobile) {
            await page.locator('button.layout-topbar-menu-button').click();
        }
        const dashboard = page.getByText('CCTSCLERK');
        await expect(dashboard).toBeVisible();
        await page.goto('/master/pension-category');
    });

    test('is the form and submit button working', async ({ page }) => {
        await page.getByRole('button', { name: 'Load Caregory Details' }).click();
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page
                .locator('div')
                .filter({ hasText: /^Pension Category Details$/ })
        ).toBeVisible();
        await page.getByRole('button', { name: 'New Primary' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'PrimaryCategory saved sucessfully!');
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'New Sub' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'SubCategory saved sucessfully!');
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'Pension Category Details added successfully'
        );
    });

    test('duplicate checking', async ({ page }) => {

        await page.getByRole('button', { name: 'Load Caregory Details' }).click();
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page
                .locator('div')
                .filter({ hasText: /^Pension Category Details$/ })
        ).toBeVisible();

        await page.getByRole('button', { name: 'New Primary' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'PrimaryCategory saved sucessfully!');
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'New Sub' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'SubCategory saved sucessfully!');
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'Pension Category Details added successfully'
        );
        await page.getByRole('button', { name: 'OK' }).click();
        await page.locator('#primary').getByLabel('dropdown trigger').click();
        await page.locator('p-dropdownitem.p-element').last().click();
        await page.locator('#sub').getByLabel('dropdown trigger').click();
        // await page.locator('#sub').getByLabel('dropdown trigger').click();
        // await page.waitForTimeout(50);
        // await page.getByRole('textbox').last().click();
        await page.locator('p-dropdownitem.p-element').last().click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Aww! Snap...')).toContainText(
            'Category already exists!'
        );
    });
});
