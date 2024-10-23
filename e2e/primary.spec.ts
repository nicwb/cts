import { test, expect } from '@playwright/test';

test.describe('Primary Category', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        await page.goto('/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if(isMobile) {
            await page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        await page.goto('/master/primary');
    });
    test('testing the form and submit button', async ({ page }) => {
        await page.getByRole('button', { name: 'Load Primary Details' }).click();
        await page.getByRole('button', { name: 'New' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'PrimaryCategory saved sucessfully!'
        );
    });
    test('duplicate primary category entry ', async ({ page }) => {
        await page.getByRole('button', { name: 'Load Primary Details' }).click();
        await page.getByRole('button', { name: 'New' }).click();
        const data1 = await page
            .locator('input[formControlName=HoaId]')
            .inputValue();

        const data2 = await page
            .locator('input[formControlName=PrimaryCategoryName]')
            .inputValue();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'PrimaryCategory saved sucessfully!'
        );
        await page.getByRole('button', { name: 'OK' }).click();
        await expect(
            page
                .getByLabel('Primary Category Details')
                .locator('div')
                .filter({ hasText: 'Head Of Account:(Major-' })
                .first()
        ).toBeHidden();

        await page.getByRole('button', { name: 'New' }).click();
        await page.locator('input[formControlName=HoaId]').fill(`${data1}`);
        // await page.locator('.p-inputtext').nth(2).fill(`${data1}`);

        await page
            .locator('input[formControlName=PrimaryCategoryName]')
            .fill(`${data2}`);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Aww! Snap...')).toContainText(
            'Primary Category already exists!'
        );
    });
});
