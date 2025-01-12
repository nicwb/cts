import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToComponentRate();
});

test('Check form validation, reset, and refresh', async ({ pensionPage }) => {
    // Add component and category
    await pensionPage.selectFirstComponent();
    await pensionPage.selectFirstPensionCategory();

    // Fill form with test data, selecting a date from the 2nd row
    await pensionPage.fillComponentRateForm({
        row: 4, // Specify the row number (2nd row)
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

test('should add new component, submit form with valid date from 2nd row, and display success message', async ({
    pensionPage,
}) => {
    // Add component and category
    await pensionPage.selectFirstComponent();
    await pensionPage.selectFirstPensionCategory();

    // Fill and submit form with a valid date from the 2nd row
    await pensionPage.fillComponentRateForm({
        row: 2,
        rateType: 'A',
        rateAmount: Math.floor(Math.random() * 100),
    });

    // Submit form and handle success
    await pensionPage.submitComponentRateForm();
    await expect(pensionPage.page.locator('p-table')).toBeVisible();
});

test('should show correct table after submitting form with valid date from 3rd row', async ({ pensionPage }) => {
    // Add component and category
    await pensionPage.selectFirstComponent();
    await pensionPage.selectFirstPensionCategory();

    // Fill and submit form with a valid date from the 3rd row
    await pensionPage.fillComponentRateForm({
        row: 3, // Specify the row number (3rd row)
        rateType: 'A',
        rateAmount: Math.floor(Math.random() * 100),
    });

    // Submit form and verify table
    await pensionPage.submitComponentRateForm();
    await pensionPage.verifyComponentRateTableData();
});
