import { test, expect } from '@playwright/test';

test.describe('testing primary category', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        const dashboard = page.getByText('CCTSCLERK');
        await expect(dashboard).toBeVisible();
        await page.goto('/#/master/app-pension/app-primary');
    });

    test('new button', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'New' })).toBeVisible();
        await page.getByRole('button', { name: 'New' }).click();
        await expect(page.getByText('Head Of Account:(Major-')).toBeVisible();
        await expect(page.getByText('Description:')).toBeVisible();
    });
    test('testing the form and submit button', async ({ page }) => {
        var ran1 = String(Math.floor(Math.random() * (99 - 10 + 1) + 10));
        var ran2 = String(Math.floor(Math.random() * (99 - 10 + 1) + 10));
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page.getByPlaceholder('0000 - 00 - 000 - 00 - 000 -')
        ).toBeVisible();
        await page
            .getByPlaceholder('0000 - 00 - 000 - 00 - 000 -')
            .fill(`2071 - 01 - 101 - 00 - 005 - V - ${ran1} - ${ran2}`);
        await expect(page.getByPlaceholder('Description')).toBeVisible();
        await page.getByPlaceholder('Description').fill(`test${ran1}${ran2}`);
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'Primary Category Details added successfully'
        );
    });
    test('duplicate primary category entry ', async ({ page }) => {
        var ran1 = String(Math.floor(Math.random() * (99 - 10 + 1) + 10));
        var ran2 = String(Math.floor(Math.random() * (99 - 10 + 1) + 10));
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page.getByPlaceholder('0000 - 00 - 000 - 00 - 000 -')
        ).toBeVisible();
        await page
            .getByPlaceholder('0000 - 00 - 000 - 00 - 000 -')
            .fill(`2071 - 01 - 101 - 00 - 005 - V - ${ran1} - ${ran2}`);
        await expect(page.getByPlaceholder('Description')).toBeVisible();
        await page.getByPlaceholder('Description').fill(`test${ran1}${ran2}`);
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'Primary Category Details added successfully'
        );
        await expect(
            page
                .getByLabel('Primary Category Details')
                .locator('div')
                .filter({ hasText: 'Head Of Account:(Major-' })
                .first()
        ).toBeHidden();

        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page.getByPlaceholder('0000 - 00 - 000 - 00 - 000 -')
        ).toBeVisible();
        await page
            .getByPlaceholder('0000 - 00 - 000 - 00 - 000 -')
            .fill(`2071 - 01 - 101 - 00 - 005 - V - ${ran1} - ${ran2}`);
        await expect(page.getByPlaceholder('Description')).toBeVisible();
        await page.getByPlaceholder('Description').fill(`test${ran1}${ran2}`);
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'This Primary number already exists. Please use a different PPO number.'
        );
    });

    test('testing the cancel button', async ({ page }) => {
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page.getByRole('button', { name: 'Cancel' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(
            page
                .getByLabel('Primary Category Details')
                .locator('div')
                .filter({ hasText: 'Head Of Account:(Major-' })
                .first()
        ).toBeHidden();
    });
    test('testing the refresh button', async ({ page }) => {
        var ran1 = String(Math.floor(Math.random() * (99 - 10 + 1) + 10));
        var ran2 = String(Math.floor(Math.random() * (99 - 10 + 1) + 10));
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page.getByPlaceholder('0000 - 00 - 000 - 00 - 000 -')
        ).toBeVisible();
        await page
            .getByPlaceholder('0000 - 00 - 000 - 00 - 000 -')
            .fill(`2071 - 01 - 101 - 00 - 005 - V - ${ran1} - ${ran2}`);
        await expect(page.getByPlaceholder('Description')).toBeVisible();
        await page.getByPlaceholder('Description').fill(`test${ran1}${ran2}`);
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'Primary Category Details added successfully'
        );

        await page.getByPlaceholder('Search').click();
        await page
            .getByPlaceholder('Search')
            .fill(`2071 - 01 - 101 - 00 - 005 - V - ${ran1} - ${ran2}`);
        await page.getByRole('toolbar').getByRole('button').nth(4).click();
        await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
        await page.getByRole('button', { name: 'Reset' }).click();
        await expect(page.getByRole('button', { name: 'Reset' })).toBeHidden();
    });
});