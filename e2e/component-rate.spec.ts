import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToComponentRate();
});

test('Check form validation, reset, and refresh', async ({ pensionPage }) => {
    // Add component and category
    await pensionPage.selectFirstComponent();
    await pensionPage.selectFirstPensionCategory();

    // Fill form with test data
    await pensionPage.fillComponentRateForm({
        useCurrentDate: true,
        rateType: 'A',
        rateAmount: Math.floor(Math.random() * 100),
    });

    // Verify form fields
    await pensionPage.verifyComponentRateFormFields();

    // Test refresh functionality
    await pensionPage.resetForm([
        'categoryName',
        'componentName',
        'rateAmount',
    ]);
    await expect(
        pensionPage.page.getByRole('button', { name: 'Submit' })
    ).toBeDisabled();
    await pensionPage.verifyFormIsReset([
        'categoryName',
        'componentName',
        'rateAmount',
    ]);
});

test('should add new component, submit form with valid date, and display success message', async ({
    pensionPage,
}) => {
    // Add component and category
    await pensionPage.selectFirstComponent();
    await pensionPage.selectFirstPensionCategory();

    // Fill and submit form with a valid date
    const validDate = await pensionPage.getValidDate();
    await pensionPage.fillComponentRateForm({
        day: validDate.getDate().toString(),
        rateType: 'A',
        rateAmount: Math.floor(Math.random() * 100),
    });

    // Submit form and handle success
    await pensionPage.submitComponentRateForm();
    await expect(pensionPage.page.locator('p-table')).toBeVisible();
});

test('should show correct table', async ({ pensionPage }) => {
    // Add component and category
    await pensionPage.selectFirstComponent();
    await pensionPage.selectFirstPensionCategory();

    // Fill and submit form with a valid future date
    const randomDays = Math.floor(Math.random() * 100) + 1;
    const futureDate = await pensionPage.getFutureDate(randomDays);
    await pensionPage.fillComponentRateForm({
        day: futureDate.getDate().toString(),
        rateType: 'A',
        rateAmount: Math.floor(Math.random() * 100),
    });

    // Submit form and verify table
    await pensionPage.submitComponentRateForm();
    await pensionPage.verifyComponentRateTableData();
});
