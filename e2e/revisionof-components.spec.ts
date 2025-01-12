import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('should reset the retrieved first pension bill', async ({
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

test('should receive all component Revision Details', async ({
    page,
    pensionPage,
}) => {
    //Arrange
    await pensionPage.shouldRetrieveFirstPensionBill();
    //Act
    await page.getByRole('button', { name: ' Search' }).click();
    await pensionPage.okSuccess();
    //Assert
    await expect(page.getByText('Pensioner\'s Details :')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Details :$/ }).nth(1)).toBeVisible();
});

test('should edit component Revision Details', async ({
    page,
    pensionPage,
}) => {
    //Arrange
    await pensionPage.shouldRetrieveFirstPensionBill();
    await page.getByRole('button', { name: ' Search' }).click();
    await pensionPage.okSuccess();
    //Act
    await expect(page.getByText('Pensioner\'s Details :')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Details :$/ }).nth(1)).toBeVisible();
    if (await page.getByRole('button', { name: 'Edit' }).first().isVisible()) {
        await page.getByRole('button', { name: 'Edit' }).first().click();
    } else {
        await page.getByRole('row').getByRole('button').first().click();
    }
    const amountInput = page
        .locator('div').filter({ hasText: /^Amount \/ Month$/ }).getByRole('textbox');
    await amountInput.fill('1500');
    if (await page.getByRole('button', { name: 'Save' }).isVisible()) {
        await page.getByRole('button', { name: 'Save' }).click();
    } else {
        await page.getByRole('row').getByRole('button').nth(2).click();
    }
    //Assert
    await pensionPage.okSuccess();
});

test('should delete a component Revision Detail', async ({
    page,
    pensionPage,
}) => {
    //Arrange
    await pensionPage.shouldRetrieveFirstPensionBill();
    await page.getByRole('button', { name: ' Search' }).click();
    await pensionPage.okSuccess();
    //Act
    await expect(page.getByText('Pensioner\'s Details :')).toBeVisible();
    await expect(page.locator('div').filter({ hasText: /^Details :$/ }).nth(1)).toBeVisible();
    await page.getByRole('row').getByRole('button').nth(1).click();
    const dialog2 = page.locator('div[role="dialog"]');
    await expect(dialog2).toBeVisible();
    await page.getByRole('button', { name: 'Yes, delete it!' }).click();
    //Assert
    await page.getByRole('button', { name: 'OK' }).waitFor();
    await page.getByRole('button', { name: 'OK' }).click();
});

test('should create a new component revision', async ({ page, pensionPage }) => {
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

    // Select the first enabled date
    const allEnabledDates = page.locator('.p-datepicker-calendar tbody td:not([aria-disabled="true"])');
    const enabledDateCount = await allEnabledDates.count();
    console.log(`Enabled dates count: ${enabledDateCount}`);

    if (enabledDateCount === 0) {
        throw new Error("No enabled dates available to select.");
    }

    // Click the first available enabled date
    await allEnabledDates.nth(0).click();
    console.log(`Selected the first available date.`);

    const randomAmount = Math.floor(Math.random() * 10000);
    console.log(`Filling amount: ${randomAmount}`);
    await amountInput.fill(randomAmount.toString());
    console.log(`Amount filled.`);

    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    console.log(`Submit button is visible.`);
    await page.getByRole('button', { name: 'Submit' }).click();
    console.log(`Form submitted.`);
    await pensionPage.okSuccess(); // Ensure this is correctly implemented
    console.log(`Success message should be visible after submission.`);
    // Check for validation errors
    const errorMessages = page.locator('.error-message'); // Adjust selector as needed
    const errorCount = await errorMessages.count();
    if (errorCount > 0) {
        console.log(`Validation errors found: ${errorCount}`);
        const errorTexts = await errorMessages.allTextContents();
        console.log(`Error messages: ${errorTexts.join(', ')}`);
    }

    await expect(pensionPage.page.locator('p-table')).toBeVisible();
});

