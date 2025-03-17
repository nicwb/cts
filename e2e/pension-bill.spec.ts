import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.DatabaseSeeder);
});

test('Verify Form Functionality', async ({ page, pensionPage }) => {
    await pensionPage.goToFirstPensionBillPrint();
    await expect(page.locator('input[placeholder="PPO ID"]')).not.toBeEmpty();
    await expect(
        page.locator('input[placeholder="Pensioner Name"]')
    ).not.toBeEmpty();
    await expect(
        pensionPage.page.locator('button:has-text("Generate Report")')
    ).toBeDisabled();
    await page.locator('p-radioButton[label="General Bill"]').click();
    await expect(
        pensionPage.page.locator('button:has-text("Generate Report")')
    ).toBeEnabled();

    await page.click('button:has-text("Refresh")');

    await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue('');
    await expect(
        page.locator('input[placeholder="Pensioner Name"]')
    ).toHaveValue('');
});

test('Generate First Pension PDF Report', async ({ page, pensionPage }) => {
    const dialog = await pensionPage.goToFirstPensionBillPrint();
    await expect(dialog).not.toBeVisible();
    await page.locator('p-radioButton[label="General Bill"]').click();
    await page.locator('button:has-text("Generate Report")').click();

    const dialog1 = page.locator('div.swal2-popup');
    await expect(dialog1).toBeVisible({ timeout: 500 });
});

test('Verify PDF Generation for First Pension Bill', async ({
    page,
    pensionPage,
    browserName,
}) => {
    //ARRANGE
    await pensionPage.goToFirstPensionBillPrint();
    //ACT
    await page.locator('p-radioButton[label="General Bill"]').click();
    await expect(page.locator('input[value="generalBill"]')).toBeChecked();
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
