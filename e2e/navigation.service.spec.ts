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
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.AccountHeadSeeder);
    await dbUtils.seedDatabase(Seeders.TreasurySeeder);
    await dbUtils.seedDatabase(Seeders.BankSeeder);
    await dbUtils.seedDatabase(Seeders.BranchSeeder);
    await dbUtils.seedDatabase(Seeders.FinancialYearSeeder);
    await dbUtils.seedDatabase(Seeders.BreakupSeeder);
    await dbUtils.seedDatabase(Seeders.CategorySeeder);
    await dbUtils.seedDatabase(Seeders.ClassificationSeeder);
    await dbUtils.seedDatabase(Seeders.ComponentRateSeeder, 16);
    await dbUtils.seedDatabase(Seeders.PrimaryCategorySeeder);
    await dbUtils.seedDatabase(Seeders.SubCategorySeeder);

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
