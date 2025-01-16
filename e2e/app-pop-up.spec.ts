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

test('should navigate to next page and display different records if pagination is possible', async ({
    page,
}) => {
    // Arrange
    const initialRecordsCount = await page.locator('p-table tbody tr').count();
    console.log('initialRecordsCount', initialRecordsCount);
    const maxRecordsPerPage = 10;
    const totalRecords = await page
        .locator('.p-paginator-totalrecords')
        .textContent();
    console.log('totalRecords', totalRecords);

    // Act & Assert
    if (totalRecords !== null) {
        if (parseInt(totalRecords) <= maxRecordsPerPage) {
            console.log('no pagination');
            const nextButton = page.locator('.p-paginator-next');
            const prevButton = page.locator('.p-paginator-prev');

            // Check for either disabled attribute or p-disabled class
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
        } else {
            console.log('pagination');

            const firstPageRecords = await page
                .locator('p-table tbody tr')
                .allTextContents();

            await page.click(
                '.p-paginator-next:not([disabled]):not(.p-disabled)'
            );
            await page.waitForSelector(
                '.p-paginator-prev:not([disabled]):not(.p-disabled)'
            );

            const nextPageRecords = await page
                .locator('p-table tbody tr')
                .allTextContents();
            expect(nextPageRecords).not.toEqual(firstPageRecords);
        }
    } else {
        console.log('Failed to get total records');
    }
});

test('should navigate to previous page if pagination is possible', async ({
    page,
}) => {
    // Arrange
    const initialRecordsCount = await page.locator('p-table tbody tr').count();
    console.log('initialRecordsCount', initialRecordsCount);

    const maxRecordsPerPage = 10;
    const totalRecords = await page
        .locator('.p-paginator-totalrecords')
        .textContent();
    console.log('totalRecords', totalRecords);

    // Act & Assert
    if (totalRecords !== null) {
        if (parseInt(totalRecords) <= maxRecordsPerPage) {
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
        } else {
            console.log('pagination');

            await page.click(
                '.p-paginator-next:not([disabled]):not(.p-disabled)'
            );
            await page.waitForSelector(
                '.p-paginator-prev:not([disabled]):not(.p-disabled)'
            );

            const secondPageRecords = await page
                .locator('p-table tbody tr')
                .allTextContents();

            await page.click(
                '.p-paginator-prev:not([disabled]):not(.p-disabled)'
            );
            await page.waitForSelector(
                '.p-paginator-next:not([disabled]):not(.p-disabled)'
            );

            const firstPageRecords = await page
                .locator('p-table tbody tr')
                .allTextContents();

            expect(firstPageRecords).not.toEqual(secondPageRecords);
        }
    } else {
        console.log('Failed to get total records');
    }
});

test('should jump to last page if pagination is possible', async ({ page }) => {
    // Arrange
    const initialRecordsCount = await page.locator('p-table tbody tr').count();
    console.log('initialRecordsCount', initialRecordsCount);

    const maxRecordsPerPage = 10;
    const totalRecords = await page
        .locator('.p-paginator-totalrecords')
        .textContent();
    console.log('totalRecords', totalRecords);

    // Act & Assert
    if (totalRecords !== null) {
        if (parseInt(totalRecords) <= maxRecordsPerPage) {
            console.log('no pagination');
            const lastButton = page.locator('.p-paginator-last');
            const isDisabled = await lastButton.evaluate(
                (el) =>
                    el.hasAttribute('disabled') ||
                    el.classList.contains('p-disabled') ||
                    el.getAttribute('aria-disabled') === 'true'
            );
            expect(isDisabled).toBe(true);
        } else {
            console.log('pagination');
            await page.click(
                '.p-paginator-last:not([disabled]):not(.p-disabled)'
            );

            const nextButton = page.locator('.p-paginator-next');
            const isDisabled = await nextButton.evaluate(
                (el) =>
                    el.hasAttribute('disabled') ||
                    el.classList.contains('p-disabled') ||
                    el.getAttribute('aria-disabled') === 'true'
            );
            expect(isDisabled).toBe(true);
        }
    } else {
        console.log('Failed to get total records');
    }
});
