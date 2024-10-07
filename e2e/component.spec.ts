import {test,expect} from "@playwright/test";

test.describe('Pension Component', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if(isMobile) {
            await page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        // Navigate to the page containing your component
        await page.goto('/#/master/app-pension/component');
    });

    test('Pension component can be saved', async ({ page }) => {
        await page.getByRole('button', { name: 'New Entry' }).click();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
    });

    test('Duplicate data Checking', async ({ page }) => {
        await page.getByRole('button', { name: 'New Entry' }).click();
        const data1= await page.locator('input[formControlName=componentName]').inputValue();
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
        await page.getByRole('button', { name: 'OK' }).click();

        await page.getByRole('button', { name: 'New Entry' }).click();
        await page.locator('input[formControlName=componentName]').fill(data1);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('heading', { name: 'Aww! Snap...' })).toBeVisible();
    });
});
