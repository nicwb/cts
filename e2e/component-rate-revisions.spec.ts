import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToComponentRateRevision();
});

test('Verifies successful navigation to the "Component Rate" page after clicking "New Component Rate" button', async ({
    page,
}) => {
    // Arrange
    // Act
    await page.getByRole('button', { name: 'New Component Rate' }).click();
    // Assert
    await expect(page).toHaveURL('/master/component-rate');
    await expect(
        page.getByRole('heading', { name: 'Component Rate' }).locator('b')
    ).toBeVisible();
});

test('Verifies form validation, reset, and refresh functionality', async ({
    page,
    pensionPage,
}) => {
    //Arrange
    //Act
    await pensionPage.openPopupAndSelectFirstRow();
    await pensionPage.verifyFormFieldIsVisible('categoryId');
    await pensionPage.verifyFormFieldIsVisible('description');
    //Assert
    await expect(page.getByRole('button', { name: 'Search' })).toBeEnabled();
    await pensionPage.resetForm(['categoryId', 'description']);
    await expect(
        pensionPage.page.getByRole('button', { name: 'Search' })
    ).toBeDisabled();
});

test('Check "no records found" message', async ({ page }) => {
    // ARRANGE

    const expectedDialogHeaders = [
        'Category ID',
        'Primary Category ID',
        'Sub Category ID',
        'Category Name',
    ];

    await page.click('app-popup-table');
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();

    for (const header of expectedDialogHeaders) {
        await expect(
            dialog.locator('th').filter({ hasText: header }).first()
        ).toBeVisible();
    }
    // ACT
    const thirdRow = dialog.locator('tbody tr').nth(2);
    await thirdRow.click();

    const searchButton = page.getByRole('button', { name: 'Search' });
    await searchButton.click();

    // ASSERT
    await expect(
        page.locator('input[formControlName="categoryId"]')
    ).toBeVisible();
    await expect(
        page.locator('input[formControlName="description"]')
    ).toBeVisible();

    const table = page.locator('p-table');
    await expect(table).toBeVisible();

    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();

    expect(rowCount).toBeGreaterThan(0);

    const firstRowText = await rows.first().textContent();

    expect(firstRowText).toBeTruthy();
    expect(firstRowText).toContain('No records found');
});

test('Verify Successful Search Functionality', async ({ page }) => {
    // ARRANGE
    const expectedDialogHeaders = [
        'Category ID',
        'Primary Category ID',
        'Sub Category ID',
        'Category Name',
    ];

    await page.click('app-popup-table');
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();
    const fourthRow = dialog.locator('tbody tr').nth(3);

    for (const header of expectedDialogHeaders) {
        await expect(
            dialog.locator('th').filter({ hasText: header }).first()
        ).toBeVisible();
    }
    // ACT
    await fourthRow.click();
    const searchButton = page.getByRole('button', { name: 'Search' });
    await searchButton.click();

    // ASSERT
    await expect(
        page.locator('input[formControlName="categoryId"]')
    ).toBeVisible();
    await expect(
        page.locator('input[formControlName="description"]')
    ).toBeVisible();

    const table = page.locator('p-table');
    await expect(table).toBeVisible();

    const rows = table.locator('tbody tr');
    const rowCount = await rows.count();

    expect(rowCount).toBeGreaterThan(0);

    const firstRowText = await rows.first().textContent();

    expect(firstRowText).toBeTruthy();
    expect(firstRowText).not.toContain('No records found');
});
