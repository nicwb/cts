import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToSubCategory();
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

    const subCategorySeederResponse = await dbUtils.seedDatabase(
        Seeders.SubCategorySeeder,
        5
    );
    expect(subCategorySeederResponse).toBe(
        'Database seeded successfully with seeder: SubCategorySeeder.'
    );
});

test('Check Input Box Visibility and Submit Successfully', async ({
    page,
    pensionPage,
}) => {
    //ARRANGE
    //ACT
    await page.getByRole('button', { name: 'New' }).click();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    //ASSERT
    await pensionPage.okSuccess();
    expect(true).toBeTruthy();
});

test('Prevent Duplicate Entry Submission In Sub Category ', async ({
    page,
    pensionPage,
}) => {
    //ARRANGE
    await page.getByRole('button', { name: 'New' }).click();

    const inputElement = page.locator('input[formControlName=SubCategoryName]');
    await inputElement.waitFor({ state: 'visible' });
    await expect(inputElement).not.toBeEmpty();
    const data1 = await inputElement.inputValue();

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okSuccess();
    expect(true).toBeTruthy();

    //ACT
    await page.getByRole('button', { name: 'New' }).click();

    const inputElement1 = page.locator(
        'input[formControlName=SubCategoryName]'
    );
    await inputElement1.waitFor({ state: 'visible' });
    await expect(inputElement1).not.toBeEmpty();
    await page.locator('input[formControlName=SubCategoryName]').fill(data1);

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();

    //ASSERT
    await pensionPage.okError();
    expect(true).toBeTruthy();
});
