import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToComponentRate();
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.DatabaseSeeder);
});

test('Verifies Component Rate Form Functionality', async ({
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

test('Successfully Adds New Component Rate', async ({ pensionPage, page }) => {
    // Add component and category
    await pensionPage.selectFirstComponent();
    await expect(page.getByText('Select Component')).toBeVisible();
    const billBreakupId = await pensionPage.selectFirstPensionCategory();

    // Fill and submit form with a valid random date
    await pensionPage.fillComponentRateForm({
        rateType: 'A',
        rateAmount: Math.floor(Math.random() * 100),
    });

    // Submit form and verify table
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okSuccess();
    const table = page.locator('p-table');
    const cells = table.locator('tbody tr td:nth-child(2)');
    const cellTexts = await cells.allInnerTexts();
    expect(cellTexts).toContain(billBreakupId);
});
