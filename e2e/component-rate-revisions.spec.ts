import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
  await pensionPage.staticLogin();
  await pensionPage.goToComponentRateRevision();
});

test('Check if the "New Component Rate" button navigates correctly', async ({ page }) => {
  //Arrange
  //Act
  await page.getByRole('button', { name: 'New Component Rate' }).click();
  //Assert
  await expect(page).toHaveURL('/master/component-rate');
  await expect(page.getByRole('heading', { name: 'Component Rate' }).locator('b')).toBeVisible();
});

test('Check form validation, reset, and refresh', async ({ page, pensionPage }) => {
  //Arrange
  //Act
  await pensionPage.openPopupAndSelectFirstRow();
  await pensionPage.verifyFormField('categoryId');
  await pensionPage.verifyFormField('description');
  //Assert
  await expect(page.getByRole('button', { name: 'Search' })).toBeEnabled();
  await pensionPage.resetForm(['categoryId', 'description']);
  await expect(pensionPage.page.getByRole('button', { name: 'Search' })).toBeDisabled();
});

test('Check Pension Component Rate form and perform search', async ({ page }) => {
  // ARRANGE
  const dialog = page.locator('div[role="dialog"]');
  const table = page.locator('p-table');
  const firstRow = dialog.locator('tbody tr:first-child');
  const searchButton = page.getByRole('button', { name: 'Search' });

  const expectedDialogHeaders = ['Category ID', 'Primary Category ID', 'Sub Category ID', 'Category Name'];
  const expectedTableHeaders = ['Component Rate ID', 'Category ID', 'Bill Breakup ID', 'Effective From Date', 'Rate Amount', 'Rate Type'];

  await page.click('app-popup-table');
  await expect(dialog).toBeVisible();

  for (const header of expectedDialogHeaders) {
    await expect(dialog.locator('th').filter({ hasText: header }).first()).toBeVisible();
  }
  // ACT
  await firstRow.click();

  await searchButton.click();

  // ASSERT
  await expect(page.locator('input[formControlName="categoryId"]')).toBeVisible();
  await expect(page.locator('input[formControlName="description"]')).toBeVisible();

  await expect(table).toBeVisible();

  const rows = table.locator('tbody tr');
  const rowCount = await rows.count();

  expect(rowCount).toBeGreaterThan(0);

  const firstRowText = await rows.first().textContent();

  expect(firstRowText).toBeTruthy();

  if (!firstRowText?.includes('No records found')) {
    for (let i = 0; i < expectedTableHeaders.length-1; i++) {
      const cell = table.locator(`td:nth-child(${i + 1})`).first();
      await expect(cell).toBeVisible();
      const cellText = await cell.textContent();
      expect(cellText).toBeTruthy();
    }
  }
});