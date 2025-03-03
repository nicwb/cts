import { Seeders, test } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
});

test('Generate first pension bill', async ({ pensionPage, dbUtils }) => {
    await dbUtils.seedDatabase(Seeders.FinancialYearSeeder);
    await dbUtils.seedDatabase(Seeders.TreasurySeeder);
    await dbUtils.seedDatabase(Seeders.BranchSeeder);
    await dbUtils.seedDatabase(Seeders.CategorySeeder);
    await dbUtils.seedDatabase(Seeders.PpoStatusFlagSeeder, 1);
    await pensionPage.generateFirstPensionBill();
});
