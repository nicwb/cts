import { Seeders, test } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('should approve PPO successfully', async ({ pensionPage, dbUtils }) => {
    // Arrange
    await dbUtils.dropDatabase();

    await dbUtils.migrateDatabase();

    await dbUtils.seedDatabase(Seeders.FinancialYearSeeder, 5);

    await dbUtils.seedDatabase(Seeders.TreasurySeeder, 5);
    await dbUtils.seedDatabase(Seeders.BranchSeeder, 5);
    await dbUtils.seedDatabase(Seeders.CategorySeeder, 5);
    await pensionPage.savePpoDetailsAndApprove();
});
