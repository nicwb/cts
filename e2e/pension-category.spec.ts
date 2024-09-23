import { test, expect } from '@playwright/test';
import { DotEnv } from 'utils/env';

test.describe('Pension Category', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if (isMobile) {
            page.locator('button.layout-topbar-menu-button').click();
        }
        const dashboard = page.getByText('CCTSCLERK');
        await expect(dashboard).toBeVisible();
        await page.goto('/#/master/app-pension/app-pension-category');
    });

    test('is the form and submit button working', async ({ page }) => {
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page
                .locator('div')
                .filter({ hasText: /^Pension Category Details$/ })
        ).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'New Primary' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'New Primary' }).click();

        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.getByRole('button', { name: 'OK' }).click();

        await expect(
            page.getByRole('button', { name: 'New Sub' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'New Sub' }).click();
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.getByRole('button', { name: 'OK' }).click();

        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'Pension Category Details added successfully'
        );
        await page.getByRole('button', { name: 'OK' }).click();
    });

    test.skip('duplicate checking', async ({ page }) => {

        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page
                .locator('div')
                .filter({ hasText: /^Pension Category Details$/ })
        ).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'New Primary' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'New Primary' }).click();

        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.getByRole('button', { name: 'OK' }).click();

        await expect(
            page.getByRole('button', { name: 'New Sub' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'New Sub' }).click();
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.getByRole('button', { name: 'OK' }).click();



        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'Pension Category Details added successfully'
        );
        await page.getByRole('button', { name: 'OK' }).click();

        await page.getByRole('button', { name: 'New' }).click();
        await page.waitForTimeout(100);
        await page.locator('#primary').getByLabel('dropdown trigger').click();

        await page.locator('p-dropdownitem.p-element').first().click();
        await page.waitForTimeout(100);
        await page.locator('#sub').getByLabel('dropdown trigger').click();


        await page.locator('p-dropdownitem.p-element').first().click();

        await page.waitForTimeout(100);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Aww! Snap...')).toContainText(
            'This Pension number already exists. Please use a different Pension number.'
        );
    });
});
