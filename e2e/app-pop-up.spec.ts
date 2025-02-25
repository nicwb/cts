import { test, expect } from './fixtures';
import { Seeders } from '../e2e/fixtures/index';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('Pagenation should be enabled', async ({ page, pensionPage, dbUtils }) => {
    await dbUtils.dropDatabase();

    const migrateResult = await dbUtils.migrateDatabase();
    expect(migrateResult).toBe('Database migrated successfully.');

    const seedResult = await dbUtils.seedDatabase(Seeders.DatabaseSeeder);
    expect(seedResult).toBe('Database seeded successfully with seeder: .');
    await pensionPage.goToComponentRateRevision();
    await pensionPage.openPopup();

    const firstPageRecords = await page
        .locator('p-table tbody tr')
        .allTextContents();
    await page.click('.p-paginator-next:not([disabled]):not(.p-disabled)');
    await page.waitForSelector(
        '.p-paginator-prev:not([disabled]):not(.p-disabled)'
    );
    const nextPageRecords = await page
        .locator('p-table tbody tr')
        .allTextContents();
    expect(nextPageRecords).not.toEqual(firstPageRecords);
});
test('Pagination should be disabled', async ({
    page,
    pensionPage,
    dbUtils,
}) => {
    // First, manually call database operations at the beginning
    await dbUtils.dropDatabase();

    const migrateResult = await dbUtils.migrateDatabase();
    expect(migrateResult).toBe('Database migrated successfully.');
    const accountHeadSeederResponse = await dbUtils.seedDatabase(
        Seeders.AccountHeadSeeder,
        5
    );
    const treasurySeederResponse = await dbUtils.seedDatabase(
        Seeders.TreasurySeeder,
        5
    );
    const bankSeederResponse = await dbUtils.seedDatabase(
        Seeders.BankSeeder,
        5
    );
    const branchSeederResponse = await dbUtils.seedDatabase(
        Seeders.BranchSeeder,
        5
    );
    const financialYearSeederResponse = await dbUtils.seedDatabase(
        Seeders.FinancialYearSeeder,
        5
    );
    const breakUpSeederResponse = await dbUtils.seedDatabase(
        Seeders.BreakupSeeder,
        5
    );
    const categorySeederResponse = await dbUtils.seedDatabase(
        Seeders.CategorySeeder,
        5
    );
    const classificationSeederResponse = await dbUtils.seedDatabase(
        Seeders.ClassificationSeeder,
        5
    );
    const componentRateSeederResponse = await dbUtils.seedDatabase(
        Seeders.ComponentRateSeeder,
        16
    );
    const primaryCategorySeederResponse = await dbUtils.seedDatabase(
        Seeders.PrimaryCategorySeeder,
        5
    );
    const subCategorySeederResponse = await dbUtils.seedDatabase(
        Seeders.SubCategorySeeder,
        5
    );
    expect(accountHeadSeederResponse).toBe(
        'Database seeded successfully with seeder: AccountHeadSeeder.'
    );
    expect(treasurySeederResponse).toBe(
        'Database seeded successfully with seeder: TreasurySeeder.'
    );
    expect(bankSeederResponse).toBe(
        'Database seeded successfully with seeder: BankSeeder.'
    );
    expect(branchSeederResponse).toBe(
        'Database seeded successfully with seeder: BranchSeeder.'
    );
    expect(financialYearSeederResponse).toBe(
        'Database seeded successfully with seeder: FinancialYearSeeder.'
    );
    expect(breakUpSeederResponse).toBe(
        'Database seeded successfully with seeder: BreakupSeeder.'
    );
    expect(categorySeederResponse).toBe(
        'Database seeded successfully with seeder: CategorySeeder.'
    );
    expect(classificationSeederResponse).toBe(
        'Database seeded successfully with seeder: ClassificationSeeder.'
    );
    expect(componentRateSeederResponse).toBe(
        'Database seeded successfully with seeder: ComponentRateSeeder.'
    );
    expect(primaryCategorySeederResponse).toBe(
        'Database seeded successfully with seeder: PrimaryCategorySeeder.'
    );
    expect(subCategorySeederResponse).toBe(
        'Database seeded successfully with seeder: SubCategorySeeder.'
    );

    await pensionPage.savePpoDetails();
    await page.goto('pension-process/approval/ppo-approval', {
        waitUntil: 'domcontentloaded',
    });
    const dialog = await pensionPage.openPopup();

    const nextButton = page.locator('.p-paginator-next');
    const prevButton = page.locator('.p-paginator-prev');

    const isNextDisabled = await nextButton.evaluate(
        (el) =>
            el.hasAttribute('disabled') ||
            el.classList.contains('p-disabled') ||
            el.getAttribute('aria-disabled') === 'true'
    );

    const isPrevDisabled = await prevButton.evaluate(
        (el) =>
            el.hasAttribute('disabled') ||
            el.classList.contains('p-disabled') ||
            el.getAttribute('aria-disabled') === 'true'
    );

    const firstRow = dialog.locator('tbody tr:first-child');
    await expect(firstRow).toBeVisible();
    await firstRow.click();
    expect(isNextDisabled).toBe(true);
    expect(isPrevDisabled).toBe(true);

    await page.getByRole('button', { name: 'Approve' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
});
