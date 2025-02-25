import { Seeders, test } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('can generate first pension bill and save', async ({
    pensionPage,
    dbUtils,
}) => {
    await dbUtils.dropDatabase();

    await dbUtils.migrateDatabase();

    await dbUtils.seedDatabase(Seeders.FinancialYearSeeder, 5);

    await dbUtils.seedDatabase(Seeders.TreasurySeeder, 5);
    await dbUtils.seedDatabase(Seeders.BranchSeeder, 5);
    await dbUtils.seedDatabase(Seeders.ComponentRateSeeder, 16);

    await pensionPage.savePpoDetailsApproveGenerateFirstPensionBill();
});
