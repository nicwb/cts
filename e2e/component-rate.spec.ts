import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToComponentRate();
});

test('Verify Component Rate Form Functionality', async ({
    pensionPage,
    page,
}) => {
    // Add component and category
    await pensionPage.selectFirstComponent();
    await expect(page.getByText('Select Component')).toBeVisible();
    await pensionPage.selectFirstPensionCategory();

    // Fill form with test data, selecting a random date
    await pensionPage.fillComponentRateForm({
        rateType: 'A',
        rateAmount: Math.floor(Math.random() * 100),
    });

    // Verify form fields
    await pensionPage.verifyComponentRateFormFields();
    // Test refresh functionality
    await pensionPage.resetForm([
        'categoryName',
        'componentName',
        'rateAmount',
    ]);
    await expect(
        pensionPage.page.getByRole('button', { name: 'Submit' })
    ).toBeDisabled();
    await pensionPage.verifyFormIsReset([
        'categoryName',
        'componentName',
        'rateAmount',
    ]);
});

test('Successfully Add New Component Rate', async ({
    pensionPage,
    page,
}) => {
    // Add component and category
    const categoryId = await pensionPage.selectFirstComponent();
    await expect(page.getByText('Select Component')).toBeVisible();
    const billBreakupId = await pensionPage.selectFirstPensionCategory();

    // Fill and submit form with a valid random date
    await pensionPage.fillComponentRateForm({
        rateType: 'A',
        rateAmount: Math.floor(Math.random() * 100),
    });

    // Submit form and verify table
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okSuccess();
    const table = page.locator('p-table');
    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
    const lastRow = rows.nth(rowCount - 1);
    const lastCategoryId = await lastRow.locator('td:nth-child(2)').innerText();
    const lastBillBreakupId = await lastRow.locator('td:nth-child(3)').innerText();
    expect(lastCategoryId).toBe(categoryId);
    expect(lastBillBreakupId).toBe(billBreakupId);
});
