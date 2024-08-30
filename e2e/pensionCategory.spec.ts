import {test, expect } from "@playwright/test";
import { DotEnv } from "utils/env"

test.describe('pensionCategory test', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        test.fixme(isMobile, "Complete task-143 before runnign this test");
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


    test('is the refresh button working', async ({ page }) => {
        await page.getByPlaceholder('Search').fill('State Pension-ROPA 2009');
        await page.getByRole('toolbar').getByRole('button').nth(4).click();
        await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
        await page.getByRole('button', { name: 'Reset' }).click();
        // Check if the table is reset
        const rowSelector = 'tbody.p-element.p-datatable-tbody';
        const rowElements = await page.$$(rowSelector);
    });
});
