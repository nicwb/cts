import { Seeders } from '../e2e/fixtures/index';
import { test } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('Navigate from PPO Entry and PPO Receipts', async ({
    pensionPage,
    dbUtils,
}) => {
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.FinancialYearSeeder);
    await dbUtils.seedDatabase(Seeders.TreasurySeeder);
    await dbUtils.seedDatabase(Seeders.BranchSeeder);
    await dbUtils.seedDatabase(Seeders.CategorySeeder);

    await pensionPage.navigateFromEntryToReceipt();
});
