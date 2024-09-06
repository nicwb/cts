import { test, expect } from "@playwright/test";

test.describe('First pension bill', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if (isMobile) {
            page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        // Navigate to the page containing your component
        await page.goto('/#/pension/modules/pension-process/pension-bill');
    });



    test('First bill generate', async ({ page }) => {
        const today = new Date();
        const day = today.getDate().toString();

        page.locator('p-button').getByRole('button').click();
        await page.locator('role=cell').filter({ hasText: /\d+/ }).first().click();
        page.getByRole('textbox', { name: 'Select a date' }).click();
        page.locator(`text="${day}"`).click();
        page.getByRole('button', { name: 'Generate' }).click();

        await expect(page.getByLabel('Success')).toBeVisible();
        await expect(page.getByText('Pension Details:PPO')).toBeVisible();
        await expect(page.getByText('Bill Details:Bill')).toBeVisible();
        await expect(page.getByText('Component Detail:Component')).toBeVisible();
    });

});