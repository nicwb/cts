import { test, expect, Seeders } from './fixtures';

test.beforeEach(async ({ pensionPage, dbUtils }) => {
    await pensionPage.staticLogin();
    await dbUtils.dropDatabase();
    await dbUtils.migrateDatabase();
    await dbUtils.seedDatabase(Seeders.DatabaseSeeder);
});

test('Verify Reset Button', async ({ page, pensionPage }) => {
    //Arrange
    await pensionPage.shouldRetrieveFirstPensionBill();
    //Act
    await page.getByRole('button', { name: ' Reset' }).click();
    //Assert
    await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue('');
});

test('Verify Retrieval', async ({ page, pensionPage }) => {
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

test('Verify Editing', async ({ page, pensionPage }) => {
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

test('Delete Revision of Components', async ({ page, pensionPage }) => {
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

test('Create New Revision of Components', async ({ page, pensionPage }) => {
    // Arrange
    const dialog = await pensionPage.shouldRetrieveFirstPensionBill();
    await page.getByRole('button', { name: ' Search' }).click();
    await pensionPage.okSuccess();
    await expect(
        pensionPage.page.getByRole('cell', { name: '1-BASIC PENSION' })
    ).toBeVisible();

    // Act
    await page.getByRole('button', { name: ' Add' }).click();
    const amountInput = page
        .locator('div')
        .filter({ hasText: /^Amount \/ Month$/ })
        .getByRole('textbox');
    await expect(amountInput).toBeVisible({ timeout: 200 });

    await page.click('app-popup-table');
    await page.waitForSelector('tbody tr');
    const firstRow2 = dialog.locator('tbody tr:first-child');
    await firstRow2.click();

    const dateInput = page.getByRole('textbox', { name: 'dd-MM-yyyy' });
    await dateInput.click();

    // Wait for the datepicker to be visible
    await page.waitForSelector('.p-datepicker-calendar', { state: 'visible' });

    // Generate a random number between 7 and 22
    const randomDate = Math.floor(Math.random() * (22 - 7 + 1)) + 7;

    // Use a more specific locator targeting current month's active dates
    const dateCell = page
        .locator(
            `.p-datepicker-calendar td:not(.p-datepicker-other-month) span:text-is("${randomDate}")`
        )
        .first();

    // Wait for the date cell to be ready with increased timeout
    await expect(dateCell).toBeVisible({ timeout: 2000 });

    // Check if this date is disabled before clicking
    const isDisabled = await dateCell.evaluate((el) =>
        el.classList.contains('p-disabled')
    );

    if (isDisabled) {
        // If the first date is disabled, try to find another valid date
        const validDateCell = page.locator(
            `.p-datepicker-calendar td:not(.p-datepicker-other-month) span:not(.p-disabled):text-is("${randomDate + 1}")`
        );
        await expect(validDateCell).toBeVisible({ timeout: 2000 });
        await validDateCell.click();
    } else {
        await dateCell.click();
    }

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();

    await pensionPage.okSuccess();
    expect(true).toBeTruthy();
});
