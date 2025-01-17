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
    const ppoId = await pensionPage.savePpoDetailsAndApprove();
    await page.goto('pension-process/pension-bill/first-pension-bill', {
        waitUntil: 'domcontentloaded',
    });
    await page
        .locator('p-button')
        .getByRole('button', { name: 'Open' })
        .click();
    await page.click('app-popup-table');

    const dialog = page.locator('.p-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('p-table')).toBeVisible();
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

    await page.getByLabel('Search data').click();
    await page.getByLabel('Search data').fill('' + ppoId);
    await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
    await page.getByRole('textbox', { name: 'Select a date' }).click();
    await page.locator('.p-datepicker-today').click();
    await expect(
        page.getByRole('textbox', { name: 'Select a date' })
    ).not.toBeEmpty();

    await page.getByRole('button', { name: 'Generate' }).click();
    await pensionPage.okSuccess();

    await page.getByRole('button', { name: 'Save' }).click();
    await pensionPage.okSuccess();
});
