import {test,expect} from "@playwright/test";

test.describe('SubCategory Details Module',()=>{
    test.beforeEach(async ({ page }) => {
    // Navigate to the static login page containing user roles
    await page.goto('/#/static-login');
    await page.getByRole('link', { name: 'cleark' }).click();
    await expect(page.getByText('CCTSCLERK')).toBeVisible();
    await page.goto('/#/master/app-pension/app-sub-category');
    });

    test('Check the "New Entry" button is visible or not',async ({page})=>{
        await expect(page.getByRole('button', { name: 'New' })).toBeVisible();
        await page.getByRole('button', { name: 'New' }).click();
    });

    test("Check the input box is visible and working or not",async ({page})=>{
        await page.getByRole('button', { name: 'New' }).click();
        await expect(page.getByLabel('Sub-Caregory Details').getByRole('textbox')).toBeVisible();
        await page.getByLabel('Sub-Caregory Details').getByRole('textbox').fill('ROPA 44211');
        await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
    });

    test('Check the cancel button is visible and working or not',async ({page})=>{
        await page.getByRole('button', { name: 'New' }).click();
        await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
    });

    test('Check the reset button is visible and working or not',async ({page})=>{

    // Wait for the table to be visible
        const tableLocator = page.locator('mh-prime-dynamic-table');
    
        // Find the search input and ensure it's visible
        await expect(page.getByPlaceholder('Search')).toBeVisible();

        // Enter a search term
        await page.getByPlaceholder('Search').fill('ROPA');

        // Click the search icon button
        const searchIconButton = page.locator('mh-prime-dynamic-table button[icon="pi pi-search"]');
        await searchIconButton.click();

        //check reset button visible
        await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
        await page.getByRole('button', { name: 'Reset' }).click();
    });

    
});