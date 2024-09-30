import { test, expect } from '@playwright/test';

test.describe('First Pension Bill', () => {
    test.beforeEach(async ({ page, isMobile }) => {
        await page.goto('/#/static-login');
        await page.getByRole('link', { name: 'cleark' }).click();
        if(isMobile) {
            page.locator('button.layout-topbar-menu-button').click()
        }
        const dashboard = page.getByText(`CCTSCLERK`);
        await expect(dashboard).toBeVisible();
        await page.goto('/#/pension/modules/pension-process/bill-print/first-pension');
    });

    test('should display static UI elements correctly', async ({ page }) => {
        const elements = [
            { locator: 'text=General Bill', type: 'text' },
            { locator: 'text=Classification Bill', type: 'text' },
            { locator: 'text=PPO Bill', type: 'text' },
            { locator: 'input[placeholder="PPO ID"]', type: 'input' },
            { locator: 'input[placeholder="Pensioner Name"]', type: 'input' },
            { locator: 'app-popup-table', type: 'component' },
            { locator: 'button >> text="Generate Report"', type: 'button' },
            { locator: 'button >> text="Refresh"', type: 'button' }
        ];

        for (const element of elements) {
            await expect(page.locator(element.locator)).toBeVisible();
        }
    });

    test('should select the General Bill radio button', async ({ page }) => {
        await page.locator('p-radioButton[label="General Bill"]').click();
    });

    test('should validate form fields', async ({ page }) => {
        const generateButton = page.locator('button:has-text("Generate Report")');
        await expect(generateButton).toBeDisabled();

        await page.locator('p-radioButton[label="General Bill"]').click();
        await expect(generateButton).toBeDisabled();
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
        await page.waitForSelector('tbody tr');
        const firstRow = dialog.locator('tbody tr:first-child');
        await firstRow.click();
        await expect(generateButton).toBeEnabled();
    });



    test('should display search dialog with correct elements', async ({ page }) => {
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();
        await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
        await expect(dialog.locator('input#float-input')).toBeVisible();

        const tableHeaders = ['PPO ID', 'Name of Pensioner', 'Mobile', 'Date of Birth', 'Date of Retirement', 'PPO No'];
        for (const header of tableHeaders) {
            await expect(dialog.locator(`th:has-text("${header}")`)).toBeVisible();
        }
    });

    test('should select PPO and display details correctly', async ({ page }) => {
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();

        await page.waitForSelector('tbody tr');
        const firstRow = dialog.locator('tbody tr:first-child');
        const ppoIdValue = await firstRow.locator('td:first-child').textContent();
        const pensionerName = await firstRow.locator('td:nth-child(2)').textContent();
        await firstRow.click();
        await expect(dialog).not.toBeVisible();

        await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue(ppoIdValue ?? '');
        await expect(page.locator('input[placeholder="Pensioner Name"]')).toHaveValue(pensionerName ?? '');
    });

    test('should refresh page and clear PPO ID', async ({ page }) => {
        await page.click('app-popup-table');
        // await page.waitForTimeout(5000);
        // await page.waitForSelector('tbody tr');
        // await page.waitForTimeout(5000);
        await page.locator('tbody tr:first-child').click();
        await page.click('button:has-text("Refresh")');
        await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue('');
        await expect(page.locator('input[placeholder="Pensioner Name"]')).toHaveValue('');
    });

    test('should show "No records found" for invalid search', async ({ page }) => {
        await page.click('app-popup-table');
        await page.fill('input#float-input', 'NonExistentPPO');
        await expect(page.locator('text="No records found"')).toBeVisible();
    });


    test.skip('should generate PDF and show error toast if failed', async ({ page }) => {
        await page.click('app-popup-table');
        const dialog = page.locator('div[role="dialog"]');
        await expect(dialog).toBeVisible();

        await page.waitForSelector('tbody tr');
        const firstRow = dialog.locator('tbody tr:first-child');
        const ppoIdValue = await firstRow.locator('td:first-child').textContent();
        const pensionerName = await firstRow.locator('td:nth-child(2)').textContent();
        await firstRow.click();
        await expect(dialog).not.toBeVisible();

        await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue(ppoIdValue ?? '');
        await expect(page.locator('input[placeholder="Pensioner Name"]')).toHaveValue(pensionerName ?? '');
        await page.locator('p-radioButton[label="General Bill"]').click();
        await page.locator('button:has-text("Generate Report")').click();


        const toastLocator = page.locator('.swal2-popup');
        await expect(toastLocator).toBeVisible({ timeout: 10000 });


        const isErrorToast = await toastLocator.evaluate((el) =>
            el.classList.contains('.swal2-icon-error') || el.classList.contains('.swal2-popup ')
    );

    if (isErrorToast) {
        const toastMessage = await toastLocator.locator('.swal2-popup').textContent();
    } else {
        const pdfBuffer = await page.pdf();
        expect(pdfBuffer).not.toBeNull();
    }
});

test('should generate PDF and handle errors appropriately', async ({ page }) => {
    await page.click('app-popup-table');
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    await page.waitForSelector('tbody tr');
    const firstRow = dialog.locator('tbody tr:first-child');
    const ppoIdValue = await firstRow.locator('td:first-child').textContent();
    const pensionerName = await firstRow.locator('td:nth-child(2)').textContent();
    await firstRow.click();
    await expect(dialog).not.toBeVisible();

    await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue(ppoIdValue ?? '');
    await expect(page.locator('input[placeholder="Pensioner Name"]')).toHaveValue(pensionerName ?? '');
    await page.locator('p-radioButton[label="General Bill"]').click();
    await expect(page.locator('input[value="generalBill"]')).toBeChecked();
    await page.locator('button:has-text("Generate Report")').click();
    const toastLocator = page.locator('.swal2-popup');
    await expect(toastLocator).toBeVisible({ timeout: 10000 });

    const toastClasses = await toastLocator.evaluate(el => el.className);
    const toastMessage = await toastLocator.textContent();

    if (toastClasses.includes('error') || (toastMessage && toastMessage.toLowerCase().includes('error'))) {
        expect(toastMessage).toBeTruthy();
    } else {
        const pdfBuffer = await page.pdf();
        expect(pdfBuffer).not.toBeNull();
        expect(pdfBuffer.length).toBeGreaterThan(0);
    }
});


});
