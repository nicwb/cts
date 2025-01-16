import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToComponentRateRevision();
    await pensionPage.openPopup();
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

test.skip('should navigate to next page and display different records if pagination is possible', async ({
    page,
}) => {
    // Arrange
    const initialRecordsCount = await page.locator('p-table tbody tr').count();
    console.log('initialRecordsCount', initialRecordsCount);
    const nextButton = page.locator('.p-paginator-next');
    const isNextEnabled = await nextButton.isEnabled();

    // Check if initial records count is 10 and next button is enabled
    if (initialRecordsCount === 10 && isNextEnabled) {
        console.log('pagination is enabled');

        // Act & Assert
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
    } else {
        console.log('no pagination');
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
    }
});

test.skip('should navigate to previous page if pagination is possible', async ({
    page,
}) => {
    // Arrange
    const initialRecordsCount = await page.locator('p-table tbody tr').count();
    console.log('initialRecordsCount', initialRecordsCount);
    const nextButton = page.locator('.p-paginator-next');
    const isNextEnabled = await nextButton.isEnabled();

    // Check if initial records count is 10 and next button is enabled
    if (initialRecordsCount === 10 && isNextEnabled) {
        console.log('pagination is enabled');

        // Act & Assert
        const firstPageRecords = await page
            .locator('p-table tbody tr')
            .allTextContents();
        await page.click('.p-paginator-next:not([disabled]):not(.p-disabled)');
        await page.waitForSelector(
            '.p-paginator-prev:not([disabled]):not(.p-disabled)'
        );
        const secondPageRecords = await page
            .locator('p-table tbody tr')
            .allTextContents();
        expect(firstPageRecords).not.toEqual(secondPageRecords);

        await page.click('.p-paginator-prev:not([disabled]):not(.p-disabled)');
        await page.waitForSelector(
            '.p-paginator-next:not([disabled]):not(.p-disabled)'
        );
        const firstPageRecordsAgain = await page
            .locator('p-table tbody tr')
            .allTextContents();
        expect(firstPageRecordsAgain).toEqual(firstPageRecords);
    } else {
        console.log('no pagination');
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
    }
});

test.skip('should jump to last page if pagination is possible', async ({
    page,
}) => {
    // Arrange
    const initialRecordsCount = await page.locator('p-table tbody tr').count();
    console.log('initialRecordsCount', initialRecordsCount);
    const nextButton = page.locator('.p-paginator-next');
    const isNextEnabled = await nextButton.isEnabled();

    // Check if initial records count is 10 and next button is enabled
    if (initialRecordsCount === 10 && isNextEnabled) {
        console.log('pagination is enabled');

        // Act & Assert
        await page.click('.p-paginator-last:not([disabled]):not(.p-disabled)');
        await page.waitForSelector(
            '.p-paginator-prev:not([disabled]):not(.p-disabled)'
        );
        await page.click('.p-paginator-prev:not([disabled]):not(.p-disabled)');
        await page.waitForSelector(
            '.p-paginator-next:not([disabled]):not(.p-disabled)'
        );
        const firstPageRecordsAgain = await page
            .locator('p-table tbody tr')
            .allTextContents();
        const firstPageRecords = await page
            .locator('p-table tbody tr')
            .allTextContents();
        expect(firstPageRecordsAgain).toEqual(firstPageRecords);
    } else {
        console.log('no pagination');
        const lastButton = page.locator('.p-paginator-last');
        const isDisabled = await lastButton.evaluate(
            (el) =>
                el.hasAttribute('disabled') ||
                el.classList.contains('p-disabled') ||
                el.getAttribute('aria-disabled') === 'true'
        );
        expect(isDisabled).toBe(true);
    }
});
