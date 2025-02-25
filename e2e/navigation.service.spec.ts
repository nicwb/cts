import { Seeders } from '../e2e/fixtures/index';
import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('Verification of navigation between ppo entry and ppo receipts', async ({
    pensionPage,
    page,
    dbUtils,
}) => {
    await dbUtils.dropDatabase();
    const migrateResponse = await dbUtils.migrateDatabase();
    expect(migrateResponse).toBe('Database migrated successfully.');
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

    // Navigate to the PPO entry page
    await page.goto('pension-process/ppo/entry', {
        waitUntil: 'domcontentloaded',
    });
    const addNewButton = page.getByRole('button', { name: 'Add New PPO' });
    await addNewButton.click();

    const messageLocator = page.locator(
        'text="No manual ppo receipt found!. Do you want add it?"'
    );
    await expect(messageLocator).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();
    expect(page.url()).toContain(
        'pension-process/ppo/ppo-receipt/new?returnUri=pension-process%2Fppo%2Fentry%2Fnew'
    );
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('button', { name: 'Yes' })).toBeVisible();
    await page.getByRole('button', { name: 'Yes' }).click();
    expect(page.url()).toContain('pension-process/ppo/entry/new');
    await page.getByRole('button', { name: 'Save' }).click();
    await pensionPage.okSuccess();
});
