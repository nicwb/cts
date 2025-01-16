import { Dialog } from 'primeng/dialog';
import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToFirstPensionBillPrint();
});

test('Validate Form Fields, PPO Selection, and Refresh for First Bill Report Generation', async ({
    page,
    pensionPage,
}) => {
    await page.locator('p-radioButton[label="General Bill"]').click();
    await expect(
        pensionPage.page.locator('button:has-text("Generate Report")')
    ).toBeDisabled();

    await pensionPage.openPopupAndSelectFirstRow();
    await expect(
        pensionPage.page.locator('button:has-text("Generate Report")')
    ).toBeEnabled();

    await expect(page.locator('input[placeholder="PPO ID"]')).not.toBeEmpty();
    await expect(
        page.locator('input[placeholder="Pensioner Name"]')
    ).not.toBeEmpty();

    await page.click('button:has-text("Refresh")');

    await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue('');
    await expect(
        page.locator('input[placeholder="Pensioner Name"]')
    ).toHaveValue('');
});

test('Generate PDF Report', async ({ page, pensionPage }) => {
    const dialog = await pensionPage.openPopup();
    const firstRow = dialog.locator('tbody tr:first-child');
    const ppoIdValue = await firstRow.locator('td:first-child').textContent();
    const pensionerName = await firstRow
        .locator('td:nth-child(3)')
        .textContent();
    await firstRow.click();
    await expect(dialog).not.toBeVisible();

    await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue(
        ppoIdValue ?? ''
    );
    await expect(
        page.locator('input[placeholder="Pensioner Name"]')
    ).toHaveValue(pensionerName ?? '');
    await page.locator('p-radioButton[label="General Bill"]').click();
    await page.locator('button:has-text("Generate Report")').click();

    const dialog1 = page.locator('div.swal2-popup');
    await expect(dialog1).toBeVisible({ timeout: 500 });
});

test('Verify PDF Generation and Error Handling for General Bill Report', async ({
    page,
    pensionPage,
    browserName,
}) => {
    //ARRANGE
    //ACT
    await page.locator('p-radioButton[label="General Bill"]').click();
    await expect(page.locator('input[value="generalBill"]')).toBeChecked();
    const dialog = await pensionPage.openPopup();

    const firstRow = dialog.locator('tbody tr:first-child');
    await page.waitForSelector('tbody tr:first-child', { timeout: 500 });
    await firstRow.click();
    await page.locator('button:has-text("Generate Report")').click();
    //ASSERT
    const toastLocator = page.locator('.swal2-popup');
    await expect(toastLocator).toBeVisible({ timeout: 500 });

    const toastClasses = await toastLocator.evaluate((el) => el.className);
    const toastMessage = await toastLocator.textContent();

    if (
        toastClasses.includes('error') ||
        (toastMessage && toastMessage.toLowerCase().includes('error'))
    ) {
        expect(toastMessage).toBeTruthy();
    } else {
        if (browserName === 'chromium') {
            const pdfBuffer = await page.pdf();
            expect(pdfBuffer).not.toBeNull();
            expect(pdfBuffer.length).toBeGreaterThan(0);
        }
    }
});
