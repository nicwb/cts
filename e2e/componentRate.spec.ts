import { test, expect } from '@playwright/test';

test.describe('Component rate test', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        await expect(page.getByText('CCTSCLERK')).toBeVisible();
        await page.goto('/#/master/app-pension/component-rate');
    });
    test('should display component rate table', async ({ page }) => {

        await expect(page.locator('#p-fieldset-0').getByText('Component Rate')).toBeVisible();
        //test for select pension category
        await expect(page.getByLabel('Component RateSelect Pension').getByRole('button').first()).toBeVisible();
        await page.getByLabel('Component RateSelect Pension').getByRole('button').first().click();
        await expect(page.getByText('Search', { exact: true })).toBeVisible();
        // Get all cells matching the selector and click the last one
        const cells = await page.getByRole('cell');
        await cells.last().click();
        await expect(page.getByText('Select Component')).toBeVisible();
        // test for select a component
        await expect(page.getByLabel('Component RateSelect Pension').getByRole('button').nth(1)).toBeVisible(); 
        await page.getByLabel('Component RateSelect Pension').getByRole('button').nth(1).click();
        const cells1 = await page.getByRole('cell');
        await cells1.last().click();
        await expect(page.getByText('Date')).toBeVisible();
        await page.locator('p-calendar').getByRole('textbox').click();
        await page.getByRole('button', { name: '2024' }).click();
        await page.getByRole('button', { name: '' }).click();
        await page.getByRole('button', { name: '' }).click();
        await page.getByRole('button', { name: '' }).click();
        await page.getByText('1993').click();
        await page.getByText('Sep').click();
        await page.getByText('11', { exact: true }).click();
        await expect(page.getByText('Rate Type P/A')).toBeVisible();
        await page.getByLabel('dropdown trigger').click();
        await page.getByLabel('A', { exact: true }).click();
        await expect(page.getByText('Amount')).toBeVisible();
        await page.getByPlaceholder('₹').click(); 
        await page.getByPlaceholder('₹').fill('74563');
        await page.getByRole('button', { name: ' Submit' }).click();
        await expect(page.getByRole('alert')).
        toHaveText(/Component Rate saved sucessfully!|ServiceException: 23505: duplicate key value violates unique constraint "component_rates_category_id_breakup_id_effective_from_date_key" DETAIL: Key (category_id, breakup_id, effective_from_date)=(29, 4, 1993-09-11) already exists./);


    });

})