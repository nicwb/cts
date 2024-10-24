import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
  await pensionPage.staticLogin();
  await pensionPage.goToComponentRateRevision();
  await pensionPage.openPopup();
});

test('should display correct number of records per page', async ({ page}) => {
  // Arrange
  // Act
  const initialRecords = await page.locator('p-table tbody tr').count();
  const maxRecordsPerPage = 11;
  // Assert
  expect(initialRecords).toBeLessThanOrEqual(maxRecordsPerPage);
});

test('should navigate to next page and display different records if pagination is possible', async ({ page, pensionPage }) => {
  //Arrange
  const initialRecordsCount = await page.locator('p-table tbody tr').count();
  const maxRecordsPerPage = 12;
  //Act
  if (initialRecordsCount < maxRecordsPerPage) {
    //Assert
    await pensionPage.verifyPaginationButtons();
  } else {
    const firstPageRecords = await page.locator('p-table tbody tr').allTextContents();
    await page.click('.p-paginator-next');
    await page.waitForSelector('.p-paginator-prev:enabled');
    //Assert
    const nextPageRecords = await page.locator('p-table tbody tr').allTextContents();
    expect(nextPageRecords).not.toEqual(firstPageRecords);
  }
});

test('should navigate to previous page if pagination is possible', async ({ page, pensionPage }) => {
  //Arrange
  const initialRecordsCount = await page.locator('p-table tbody tr').count();
  const maxRecordsPerPage = 12;
  //Act
  if (initialRecordsCount < maxRecordsPerPage) {
    //Assert
    await pensionPage.verifyPaginationButtons();
  } else {
    await page.click('.p-paginator-next');
    await page.waitForSelector('.p-paginator-prev:enabled');

    //Assert
    const secondPageRecords = await page.locator('p-table tbody tr').allTextContents();
    await page.click('.p-paginator-prev');
    await page.waitForSelector('.p-paginator-next:enabled');

    const firstPageRecords = await page.locator('p-table tbody tr').allTextContents();
    expect(firstPageRecords).not.toEqual(secondPageRecords);
  }
});

test('should jump to last page if pagination is possible', async ({ page}) => {
  //Arrange
  const initialRecordsCount = await page.locator('p-table tbody tr').count();
  const maxRecordsPerPage = 12;
  //Act
  if (initialRecordsCount < maxRecordsPerPage) {
    //Assert
    const lastButton = page.locator('.p-paginator-last');
    await expect(lastButton).toBeDisabled();
  } else {
    await page.click('.p-paginator-last');
    //Assert
    await page.waitForSelector('.p-paginator-next:disabled');

    const isNextButtonDisabled = await page.locator('.p-paginator-next').isDisabled();
    expect(isNextButtonDisabled).toBe(true);
  }
});
