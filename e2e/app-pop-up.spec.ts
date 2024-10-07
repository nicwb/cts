import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
  await pensionPage.staticLogin();
});


test('should open the popup and display correct content', async ({ page }) => {
  //Arrange
  await page.goto('/#/master/app-pension/component-rate-revisions');
  //Act
  await page.click('app-popup-table');
  const dialog = page.locator('.p-dialog');

  //Assert
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('input#float-input')).toBeVisible();
  await expect(dialog.locator('p-table')).toBeVisible();
});

test('should display correct number of records per page', async ({ page }) => {
  // Arrange
  await page.goto('/#/master/app-pension/component-rate-revisions');
  await page.click('app-popup-table');
  // Act
  const dialog = page.locator('.p-dialog');
  // Assert
  await expect(dialog).toBeVisible();
  //Act
  const initialRecords = await page.locator('p-table tbody tr').count();
  const maxRecordsPerPage = 11;
  //Assert
  expect(initialRecords).toBeLessThanOrEqual(maxRecordsPerPage);
});

test('should navigate to next page and display different records if pagination is possible', async ({ page }) => {
  // Arrange
  await page.goto('/#/master/app-pension/component-rate-revisions');
  await page.click('app-popup-table');
  const dialog = page.locator('.p-dialog');
  // Assert
  await expect(dialog).toBeVisible();
  // Arrange
  const initialRecordsCount = await page.locator('p-table tbody tr').count();
  const maxRecordsPerPage = 12;
  //Act
  if (initialRecordsCount < maxRecordsPerPage) {
    const nextButton = page.locator('.p-paginator-next');
    await expect(nextButton).toBeDisabled();
  } else {
    const initialRecords = await page.locator('p-table tbody tr').allTextContents();

    await page.click('.p-paginator-next');
    await page.waitForTimeout(200);

    // Assert
    const nextPageRecords = await page.locator('p-table tbody tr').allTextContents();
    expect(nextPageRecords).not.toEqual(initialRecords);
  }
});

test('should navigate to previous page if pagination is possible', async ({ page }) => {
  // Arrange
  await page.goto('/#/master/app-pension/component-rate-revisions');
  await page.click('app-popup-table');
  const dialog = page.locator('.p-dialog');

  // Assert
  await expect(dialog).toBeVisible();

  // Arrange
  const initialRecordsCount = await page.locator('p-table tbody tr').count();
  const maxRecordsPerPage = 12;
  //Act
  if (initialRecordsCount < maxRecordsPerPage) {
    //Assert
    const nextButton = page.locator('.p-paginator-next');
    await expect(nextButton).toBeDisabled();

    const prevButton = page.locator('.p-paginator-prev');
    await expect(prevButton).toBeDisabled(); // Ensure the "Previous" button is disabled
  } else {
    //Assert
    await page.click('.p-paginator-next');
    await page.waitForTimeout(200);

    // Arrange
    const secondPageRecords = await page.locator('p-table tbody tr').allTextContents();

    // Act
    await page.click('.p-paginator-prev');
    await page.waitForTimeout(200);
    const backToFirstPageRecords = await page.locator('p-table tbody tr').allTextContents();

    // Assert
    expect(backToFirstPageRecords).not.toEqual(secondPageRecords);
  }
});

test('should jump to last page if pagination is possible', async ({ page }) => {
  // Arrange
  await page.goto('/#/master/app-pension/component-rate-revisions');
  await page.click('app-popup-table');
  const dialog = page.locator('.p-dialog');

  // Assert
  await expect(dialog).toBeVisible();

  // Arrange
  const initialRecordsCount = await page.locator('p-table tbody tr').count();
  const maxRecordsPerPage = 12;

  //Act
  if (initialRecordsCount < maxRecordsPerPage) {
    // Act
    const lastButton = page.locator('.p-paginator-last');
    await expect(lastButton).toBeDisabled();
  } else {
    // Act
    await page.click('.p-paginator-last');
    await page.waitForTimeout(200);

    //Assert
    const isNextButtonDisabled = await page.locator('.p-paginator-next').isDisabled();
    expect(isNextButtonDisabled).toBe(true); // Verify that we're on the last page
  }
});

