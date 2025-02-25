import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToComponentRate();
    await dbUtils.dropDatabase();

    const migrateResult = await dbUtils.migrateDatabase();
    expect(migrateResult).toBe('Database migrated successfully.');

    const financialYearSeederResponse = await dbUtils.seedDatabase(
        Seeders.FinancialYearSeeder,
        5
    );
    expect(financialYearSeederResponse).toBe(
        'Database seeded successfully with seeder: FinancialYearSeeder.'
    );

    const treasurySeederResponse = await dbUtils.seedDatabase(
        Seeders.TreasurySeeder,
        5
    );
    expect(treasurySeederResponse).toBe(
        'Database seeded successfully with seeder: TreasurySeeder.'
    );

    const categorySeederResponse = await dbUtils.seedDatabase(
        Seeders.CategorySeeder,
        5
    );
    expect(categorySeederResponse).toBe(
        'Database seeded successfully with seeder: CategorySeeder.'
    );

    const breakUpSeederResponseSeederResponse = await dbUtils.seedDatabase(
        Seeders.BreakupSeeder,
        5
    );
    expect(breakUpSeederResponseSeederResponse).toBe(
        'Database seeded successfully with seeder: BreakupSeeder.'
    );
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

test('Successfully Add New Component Rate', async ({ pensionPage, page }) => {
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
    const lastBillBreakupId = await lastRow
        .locator('td:nth-child(3)')
        .innerText();
    expect(lastCategoryId).toBe(categoryId);
    expect(lastBillBreakupId).toBe(billBreakupId);
});
