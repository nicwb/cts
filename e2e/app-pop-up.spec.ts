import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('Pagenation should be enabled', async ({ page, pensionPage, dbUtils }) => {
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.DatabaseSeeder);

    await pensionPage.goToComponentRateRevision();
    await pensionPage.openPopup();

    const firstPageRecords = await page
        .locator('p-table tbody tr')
        .allTextContents();
    await page.click('.p-paginator-next:not([disabled]):not(.p-disabled)');
    await page.waitForSelector(
        '.p-paginator-prev:not([disabled]):not(.p-disabled)'
    );
    const nextPageRecords = await page
        .locator('p-table tbody tr')
        .allTextContents();
    expect(nextPageRecords).not.toEqual(firstPageRecords);
});
test('Pagination should be disabled', async ({
    page,
    pensionPage,
    dbUtils,
}) => {
    // First, manually call database operations at the beginning
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

    await pensionPage.savePpoDetails();
    await page.goto('pension-process/approval/ppo-approval', {
        waitUntil: 'domcontentloaded',
    });
    const dialog = await pensionPage.openPopup();

    const nextButton = page.locator('.p-paginator-next');
    const prevButton = page.locator('.p-paginator-prev');

    const isNextDisabled = await nextButton.evaluate(
        (el) =>
            el.hasAttribute('disabled') ||
            el.classList.contains('p-disabled') ||
            el.getAttribute('aria-disabled') === 'true'
    );

    const isPrevDisabled = await prevButton.evaluate(
        (el) =>
            el.hasAttribute('disabled') ||
            el.classList.contains('p-disabled') ||
            el.getAttribute('aria-disabled') === 'true'
    );

    const firstRow = dialog.locator('tbody tr:first-child');
    await expect(firstRow).toBeVisible();
    await firstRow.click();
    expect(isNextDisabled).toBe(true);
    expect(isPrevDisabled).toBe(true);

    await page.getByRole('button', { name: 'Approve' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
});
