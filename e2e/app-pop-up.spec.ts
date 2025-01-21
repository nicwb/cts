import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
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
    await page.goto('pension-process/approval/ppo-approval', {
        waitUntil: 'domcontentloaded',
    });
    const dialog = await pensionPage.openPopup();

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
    const firstRow = dialog.locator('tbody tr:first-child');
    await expect(firstRow).toBeVisible();
    await firstRow.click();
    expect(isNextDisabled).toBe(true);
    expect(isPrevDisabled).toBe(true);

    await page.getByRole('button', { name: 'Approve' }).click();
    await page.getByRole('button', { name: 'OK' }).click();
});
