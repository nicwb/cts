import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
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

    const accountHeadSeederResponse = await dbUtils.seedDatabase(
        Seeders.AccountHeadSeeder,
        5
    );
    expect(accountHeadSeederResponse).toBe(
        'Database seeded successfully with seeder: AccountHeadSeeder.'
    );

    const categorySeederResponse = await dbUtils.seedDatabase(
        Seeders.CategorySeeder,
        5
    );
    expect(categorySeederResponse).toBe(
        'Database seeded successfully with seeder: CategorySeeder.'
    );
    await pensionPage.goToPensionCategory();

    const primaryCategorySeederResponse = await dbUtils.seedDatabase(
        Seeders.PrimaryCategorySeeder,
        5
    );
    expect(primaryCategorySeederResponse).toBe(
        'Database seeded successfully with seeder: PrimaryCategorySeeder.'
    );

    const subCategorySeederResponse = await dbUtils.seedDatabase(
        Seeders.SubCategorySeeder,
        5
    );
    expect(subCategorySeederResponse).toBe(
        'Database seeded successfully with seeder: SubCategorySeeder.'
    );
});

test('Prevent Duplicate Pension Category Selection', async ({
    page,
    pensionPage,
}) => {
    await expect(page.getByText('Primary Category Name:')).toBeVisible();

    await page.locator('#primary').getByLabel('dropdown trigger').click();
    await page.locator('p-dropdownitem.p-element').first().click();

    await page.locator('#sub').getByLabel('dropdown trigger').click();
    await page.waitForSelector('p-dropdownitem.p-element', {
        state: 'visible',
    });
    await page
        .waitForSelector('.ngx-spinner-overlay', {
            state: 'hidden',
            timeout: 5000,
        })
        .catch(() => {});
    await page.locator('p-dropdownitem.p-element').nth(1).click();
    // Submit button interaction
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okError();
});
