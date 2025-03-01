import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.FinancialYearSeeder);
    await dbUtils.seedDatabase(Seeders.TreasurySeeder);
    await dbUtils.seedDatabase(Seeders.AccountHeadSeeder);
    await dbUtils.seedDatabase(Seeders.CategorySeeder);
    await pensionPage.goToPensionCategory();
    await dbUtils.seedDatabase(Seeders.PrimaryCategorySeeder);
    await dbUtils.seedDatabase(Seeders.SubCategorySeeder);
});

test('Prevent Duplicate Pension Category Selection', async ({
    page,
    pensionPage,
}) => {
    await expect(page.getByText('Primary Category Name:')).toBeVisible();

    await page.locator('#primary').getByLabel('dropdown trigger').click();
    await page.locator('p-dropdownitem.p-element').first().click();

    await page.locator('#sub').getByLabel('dropdown trigger').click();
    await page.waitForSelector('p-dropdownitem.p-element', {
        state: 'visible',
    });
    await page
        .waitForSelector('.ngx-spinner-overlay', {
            state: 'hidden',
            timeout: 5000,
        })
        .catch(() => {});
    await page.locator('p-dropdownitem.p-element').nth(1).click();
    // Submit button interaction
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okError();
});
