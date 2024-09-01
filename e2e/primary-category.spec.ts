import { test, expect } from '@playwright/test';

test.describe('testing primary category', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        test.fixme(isMobile, "Complete task-141 before runnign this test");
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

        await page.getByRole('button', { name: 'New' }).click();

        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'Primary Category Details added successfully'
        );
    });
    test('duplicate primary category entry ', async ({ page }) => {
        await page.getByRole('button', { name: 'New' }).click();
        let data1= await page.locator('input[formControlName=HoaId]').inputValue();

        let data2= await page.locator('input[formControlName=PrimaryCategoryName]').inputValue();
        console.log(data2);
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
        await page.locator('input[formControlName=HoaId]').fill(`${data1}`);
        // await page.locator('.p-inputtext').nth(2).fill(`${data1}`);

        await page.locator('input[formControlName=PrimaryCategoryName]').fill(`${data2}`);
        await expect(
            page.getByRole('button', { name: 'Submit' })
        ).toBeVisible();
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByRole('alert')).toContainText(
            'This Primary number already exists.'
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
});




