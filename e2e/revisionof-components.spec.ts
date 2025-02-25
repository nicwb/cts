import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
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
    const classificationSeederResponse = await dbUtils.seedDatabase(
        Seeders.ClassificationSeeder,
        5
    );
    expect(classificationSeederResponse).toBe(
        'Database seeded successfully with seeder: ClassificationSeeder.'
    );
    const branchSeederResponse = await dbUtils.seedDatabase(
        Seeders.BranchSeeder,
        5
    );
    expect(branchSeederResponse).toBe(
        'Database seeded successfully with seeder: BranchSeeder.'
    );
    const componentRateSeederResponse = await dbUtils.seedDatabase(
        Seeders.ComponentRateSeeder,
        5
    );
    expect(componentRateSeederResponse).toBe(
        'Database seeded successfully with seeder: ComponentRateSeeder.'
    );
});

test('Verify Reset Button Clears First Pension Bill Data', async ({
    page,
    pensionPage,
}) => {
    //Arrange
    await pensionPage.shouldRetrieveFirstPensionBill();
    //Act
    await page.getByRole('button', { name: ' Reset' }).click();
    //Assert
    await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue('');
});

test('Verify Retrieval of Pension Bill Revision Details', async ({
    page,
    pensionPage,
}) => {
    //Arrange
    await pensionPage.shouldRetrieveFirstPensionBill();
    //Act
    await page.getByRole('button', { name: ' Search' }).click();
    await pensionPage.okSuccess();
    //Assert
    await expect(page.getByText("Pensioner's Details :")).toBeVisible();
    await expect(
        page
            .locator('div')
            .filter({ hasText: /^Details :$/ })
            .nth(1)
    ).toBeVisible();
});

test('Verify Editing of Pension Bill Revision Details', async ({
    page,
    pensionPage,
}) => {
    //Arrange
    await pensionPage.shouldRetrieveFirstPensionBill();
    await page.getByRole('button', { name: ' Search' }).click();
    await pensionPage.okSuccess();
    //Act
    await expect(page.getByText("Pensioner's Details :")).toBeVisible();
    await expect(
        page
            .locator('div')
            .filter({ hasText: /^Details :$/ })
            .nth(1)
    ).toBeVisible();
    if (await page.getByRole('button', { name: 'Edit' }).first().isVisible()) {
        await page.getByRole('button', { name: 'Edit' }).first().click();
    } else {
        await page.getByRole('row').getByRole('button').first().click();
    }
    const amountInput = page
        .locator('div')
        .filter({ hasText: /^Amount \/ Month$/ })
        .getByRole('textbox');
    await amountInput.fill('1500');
    if (await page.getByRole('button', { name: 'Save' }).isVisible()) {
        await page.getByRole('button', { name: 'Save' }).click();
    } else {
        await page.getByRole('row').getByRole('button').nth(2).click();
    }
    //Assert
    await pensionPage.okSuccess();
});

test('Delete Pensioner Revision Detail Successfully', async ({
    page,
    pensionPage,
}) => {
    //Arrange
    await pensionPage.shouldRetrieveFirstPensionBill();
    await page.getByRole('button', { name: ' Search' }).click();
    await pensionPage.okSuccess();
    //Act
    await expect(page.getByText("Pensioner's Details :")).toBeVisible();
    await expect(
        page
            .locator('div')
            .filter({ hasText: /^Details :$/ })
            .nth(1)
    ).toBeVisible();
    await page.getByRole('row').getByRole('button').nth(1).click();
    const dialog2 = page.locator('div[role="dialog"]');
    await expect(dialog2).toBeVisible();
    await page.getByRole('button', { name: 'Yes, delete it!' }).click();
    //Assert
    await page.getByRole('button', { name: 'OK' }).waitFor();
    await page.getByRole('button', { name: 'OK' }).click();
});

test('Create New Pensioner Revision Successfully', async ({
    page,
    pensionPage,
}) => {
    // Arrange
    const dialog = await pensionPage.shouldRetrieveFirstPensionBill();
    await page.getByRole('button', { name: ' Search' }).click();
    await pensionPage.okSuccess();

    // Act
    await page.getByRole('button', { name: ' Add' }).click();
    const amountInput = page.locator('input[formControlName="amount"]');
    await page.click('app-popup-table');
    await page.waitForSelector('tbody tr');
    const firstRow2 = dialog.locator('tbody tr:first-child');
    await firstRow2.click();

    const dateInput = page.getByRole('textbox', { name: 'dd-MM-yyyy' });
    await dateInput.click();

    // Wait for the datepicker to be visible
    await page.waitForSelector('.p-datepicker-calendar', { state: 'visible' });

    // Generate a random number between 7 and 24
    const randomDate = Math.floor(Math.random() * (24 - 7 + 1)) + 7;

    // Use a more specific locator to click the span element
    const selectedDate = page
        .locator('span')
        .filter({ hasText: new RegExp(`^${randomDate}$`) });

    // Ensure that the selected date is visible and click it
    await expect(selectedDate).toBeVisible({ timeout: 500 });
    await selectedDate.click();

    const randomAmount = Math.floor(Math.random() * 10000);
    await amountInput.fill(randomAmount.toString());

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();

    await pensionPage.okSuccess();
    expect(true).toBeTruthy();
});
