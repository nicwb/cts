import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    // Add wait for table to be fully loaded
    await pensionPage.page.waitForSelector('p-table tbody tr');
});

test('should display correct number of records per page', async ({ page }) => {
    // Arrange & Act
    const initialRecords = await page.locator('p-table tbody tr').count();
    const maxRecordsPerPage = 11;
    // Assert
    expect(initialRecords).toBeLessThanOrEqual(maxRecordsPerPage);
});

test('Pagenation should be enabled', async ({ page, pensionPage }) => {
    await pensionPage.goToComponentRateRevision();
    await pensionPage.openPopup();

    const initialRecordsCount = await page.locator('p-table tbody tr').count();
    console.log('initialRecordsCount', initialRecordsCount);
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
test('Pagenation should be disabled', async ({ page, pensionPage }) => {
    await pensionPage.savePpoDetails();
    await page.goto('pension-process/approval/ppo-approval', {
        waitUntil: 'domcontentloaded',
    });
    await pensionPage.openPopup();
    const initialRecordsCount = await page.locator('p-table tbody tr').count();
    console.log('initialRecordsCount', initialRecordsCount);
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
    expect(isNextDisabled).toBe(true);
    expect(isPrevDisabled).toBe(true);
});
