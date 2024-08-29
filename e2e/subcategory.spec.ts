import { test, expect } from '@playwright/test';

test.describe('SubCategory Details Module', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the static login page containing user roles
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        await expect(page.getByText('CCTSCLERK')).toBeVisible();
        await page.goto('/#/master/app-pension/app-sub-category');
    });

    test('Check the "New Entry" button is visible or not', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'New' })).toBeVisible();
    });

    test('Check the input box is visible and working or not and submit it successfully', async ({
        page,
    }) => {
        let num = Math.floor(Math.random() * 1000 - 999 + 1) + 999;
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page.getByLabel('Sub-Caregory Details').getByRole('textbox')
        ).toBeVisible();
        await page
            .getByLabel('Sub-Caregory Details')
            .getByRole('textbox')
            .fill(`ROPA ${num} `);
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'Sub Category Details added successfully'
        );
    });

    test('Duplicate Data Checking ', async ({ page }) => {
        let num = Math.floor(Math.random() * 1000 - 999 + 1) + 999;
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page.getByLabel('Sub-Caregory Details').getByRole('textbox')
        ).toBeVisible();
        await page
            .getByLabel('Sub-Caregory Details')
            .getByRole('textbox')
            .fill(`ROPA ${num} `);
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'Sub Category Details added successfully'
        );
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page.getByLabel('Sub-Caregory Details').getByRole('textbox')
        ).toBeVisible();
        await page
            .getByLabel('Sub-Caregory Details')
            .getByRole('textbox')
            .fill(`ROPA ${num} `);
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'This already exsists.'
        );
    });

    test('Check the cancel button is visible and working or not', async ({
        page,
    }) => {
        await page.getByRole('button', { name: 'New' }).click();
        await expect(
            page.getByRole('button', { name: 'Cancel' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Cancel' }).click();
        await expect(
            page.getByLabel('Sub-Caregory Details').getByRole('textbox')
        ).toBeHidden();
    });
});
