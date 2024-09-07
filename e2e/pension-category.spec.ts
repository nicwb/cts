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
        await expect(
            page.getByRole('button', { name: 'New Sub' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'New Sub' }).click();
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert').first()).toContainText(
            'Pension Category Details added successfully'
        );
    });

    test('duplicate checking', async ({ page }) => {

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
        await expect(
            page.getByRole('button', { name: 'New Sub' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'New Sub' }).click();
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        page.waitForTimeout(100);

        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert').first()).toContainText(
            'Pension Category Details added successfully'
        );

        await page.getByRole('button', { name: 'New' }).click();
        await page.locator('#primary').getByLabel('dropdown trigger').click();

        await page.locator('p-dropdownitem.p-element').first().click();

        await page.locator('#sub').getByLabel('dropdown trigger').click();


        await page.locator('p-dropdownitem.p-element').first().click();

        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert').first()).toContainText(
            'Pension Category Details already exsists'
        );
    });
});
