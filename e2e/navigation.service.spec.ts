import { Seeders } from '../e2e/fixtures/index';
import { test } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.FinancialYearSeeder);
    await dbUtils.seedDatabase(Seeders.TreasurySeeder);
    await dbUtils.seedDatabase(Seeders.BranchSeeder);
    await dbUtils.seedDatabase(Seeders.CategorySeeder);
    await pensionPage.goToPPOEntry();
});

test('Navigate from PPO Entry and PPO Receipt', async ({ pensionPage }) => {
    await pensionPage.navigateFromEntryToReceipt();
});
