import { test, expect } from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
    await pensionPage.goToPensionCategory();
});

test('Prevent Duplicate Pension Category Selection', async ({
    page,
    pensionPage,
}) => {
    await expect(page.getByText('Primary Category Name:')).toBeVisible();
    const maximizeButton = page.locator(
        'span.p-dialog-header-maximize-icon.ng-tns-c94-42.pi.pi-window-maximize'
    );
    await maximizeButton.click();

    await page.locator('#primary').getByLabel('dropdown trigger').click();
    const primaryDropdownOptions = page.locator('p-dropdownitem.p-element');
    await primaryDropdownOptions.last().click();

    await page.locator('#sub').getByLabel('dropdown trigger').click();
    await page.waitForSelector('p-dropdownitem.p-element', {
        state: 'visible',
    });
    await page
        .waitForSelector('.ngx-spinner-overlay', {
            state: 'hidden',
            timeout: 500,
        })
        .catch(() => {});
    const secondaryDropdownOptions = page.locator('p-dropdownitem.p-element');
    await secondaryDropdownOptions.last().click();
    // Submit button interaction
    await page.waitForLoadState('networkidle');
    await page.getByRole('button', { name: 'Submit' }).click();
    await pensionPage.okError();
});
