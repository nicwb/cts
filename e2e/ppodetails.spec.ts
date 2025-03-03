import { Seeders, test } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('Save PPO details', async ({ pensionPage, dbUtils }) => {
    // Arrange
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.FinancialYearSeeder);
    await dbUtils.seedDatabase(Seeders.TreasurySeeder);
    await dbUtils.seedDatabase(Seeders.BranchSeeder);
    await dbUtils.seedDatabase(Seeders.CategorySeeder);
    await dbUtils.seedDatabase(Seeders.PpoReceiptSeeder, 1);
    await pensionPage.savePpoDetails();
});
