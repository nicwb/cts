import {test, expect } from "@playwright/test";
import { DotEnv } from "utils/env"

test.describe('pensionCategory test', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/#/static-login');
    await page.getByRole('link', { name: 'cleark' }).click();
    const dashboard = page.getByText('CCTSCLERK');
    await expect(dashboard).toBeVisible();
        // Navigate to the page containing your component
        await page.goto('/#/master/app-pension/app-pension-category');
    });
    test('is the page open', async ({ page }) => {
        await expect(
            page
                .locator('app-common-header div')
                .filter({ hasText: 'Pension Caregory Details' })
                .nth(3)
        ).toBeVisible();
    });
    // checking the new button
    test('check new button', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'New' })).toBeVisible();
        await page.getByRole('button', { name: 'New' }).click();
    });
    test('is the dialogbox opening', async ({ page }) => {
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page
                .locator('div')
                .filter({ hasText: /^Pension Category Details$/ })
        ).toBeVisible();
    });
    test('is the form and submit button working', async ({ page }) => {
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page
                .getByLabel('Pension Category Details')
                .locator('div')
                .filter({ hasText: 'Primary Category Name:Select' })
                .first()
        ).toBeVisible();
        await expect(
            page.getByText('Select a PrimaryCategoryName')
        ).toBeVisible();
        await page.getByText('Select a PrimaryCategoryName').click();

        await expect(page.getByLabel('-State Pension')).toBeVisible();
        await page.getByLabel('-State Pension').click();

        await expect(page.getByText('Select a SubCategoryName')).toBeVisible();
        await page.getByText('Select a SubCategoryName').click();

        await expect(page.getByText('-NO SUB CATEGORY')).toBeVisible();
        await page.getByText('-NO SUB CATEGORY').click();

        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
    });

    test('is the cancle button working', async ({ page }) => {
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page.getByRole('button', { name: 'Cancel' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
    });

    test('is the table showing', async ({ page }) => {
        await expect(
            page
                .locator('div')
                .filter({
                    hasText:
                        'Export To Excel Export To Pdf Category ID Primary Category ID Sub Category ID',
                })
                .nth(4)
        ).toBeVisible();
    });

    test('is the refresh button working', async ({ page }) => {
        await page.getByPlaceholder('Search').fill('State Pension-ROPA 2009');
        await page.getByRole('toolbar').getByRole('button').nth(4).click();
        await page.waitForTimeout(2000);
        await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
        await page.getByRole('button', { name: 'Reset' }).click();
        // Check if the table is reset
        const rowSelector = 'tbody.p-element.p-datatable-tbody';
        const rowElements = await page.$$(rowSelector);
        if(rowElements.length!=0){
            console.log('data is showing');
        }else{
            console.error('data is not shown');
        }
        // Take a screenshot for debugging
        await page.screenshot({ path: DotEnv.NG_APP_PLAYWRIGHT_SCREENSHOT_DIR+ 'after_reset.png' });
    });
    test('should change table query to display different number of rows', async ({ page }) => {
        // console.log('Starting table query change test');

        // Ensure the table is visible
        await page.waitForSelector('mh-prime-dynamic-table', { state: 'visible', timeout: 10000 });

        const rowOptions = [10, 30, 50,100];

        for (const option of rowOptions) {
            // console.log(`Testing for ${option} rows`);

            // Locate and click the rows per page dropdown trigger
            const dropdownTrigger = page.locator('p-dropdown .p-dropdown-trigger');
            await dropdownTrigger.click();

            // Select the option from the dropdown
            const optionLocator = page.locator(`li[aria-label="${option}"]`);
            await optionLocator.click();

            // Wait for the table data to refresh
            await page.waitForTimeout(2000);

            // Locate the rows in the table
            const rows = page.locator('mh-prime-dynamic-table .p-datatable-row');
            const rowCount = await rows.count();

            // Verify the number of rows displayed
            // console.log(`Number of rows displayed: ${rowCount}`);
            expect(rowCount).toBeLessThanOrEqual(option);

            // Verify the dropdown value
            const selectedValue = await page.locator('p-dropdown .p-dropdown-label').textContent();
            expect(selectedValue?.trim()).toBe(option.toString());

            // console.log(`Verified ${option} rows option`);
        }

        // console.log('Table query change test completed');
    });
    test('debug: log HTML and take screenshot', async ({ page }) => {
        await page.waitForTimeout(10000);
        // console.log(await page.evaluate(() => document.body.innerHTML));
        await page.screenshot({ path: DotEnv.NG_APP_PLAYWRIGHT_SCREENSHOT_DIR + '/debug-screenshot.png', fullPage: true });
      });
});
