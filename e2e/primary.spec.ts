import { test, expect } from '@playwright/test';

test.describe('Primary Category', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if(isMobile) {
            await page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
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
        await page.getByRole('button', { name: 'New' }).click();

        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'Primary Category Details added successfully'
        );
        await page.getByRole('button', { name: 'OK' }).click();
    });


    test.fixme('duplicate primary category entry ', async ({ page }) => {
        await page.getByRole('button', { name: 'New' }).click();
        const data1 = await page
            .locator('input[formControlName=HoaId]')
            .inputValue();

        const data2 = await page
            .locator('input[formControlName=PrimaryCategoryName]')
            .inputValue();
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Success')).toContainText(
            'Primary Category Details added successfully'
        );
        await page.getByRole('button', { name: 'OK' }).click();
        await expect(
            page
                .getByLabel('Primary Category Details')
                .locator('div')
                .filter({ hasText: 'Head Of Account:(Major-' })
                .first()
        ).toBeHidden();

        await page.getByRole('button', { name: 'New' }).click();
        await page.locator('input[formControlName=HoaId]').fill(`${data1}`);
        // await page.locator('.p-inputtext').nth(2).fill(`${data1}`);

        await page
            .locator('input[formControlName=PrimaryCategoryName]')
            .fill(`${data2}`);
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByLabel('Aww! Snap...')).toContainText(
            'This Primary number already exists.'
        );
        await page.getByRole('button', { name: 'OK' }).click();
    });



});
