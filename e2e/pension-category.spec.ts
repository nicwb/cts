import { test} from './fixtures';

test.beforeEach(async ({ pensionPage }) => {
  await pensionPage.staticLogin();
  await pensionPage.goToPensionCategory();
});

    test('duplicate checking', async ({ page, pensionPage}) => {
        await page.locator('#primary').getByLabel('dropdown trigger').click();
        await page.locator('p-dropdownitem.p-element').first().click();

        await page.locator('#sub').getByLabel('dropdown trigger').click();
        // Wait for dropdown options to be visible
        await page.waitForSelector('p-dropdownitem.p-element', { state: 'visible' });
        // Wait for any loading spinner to disappear
        await page.waitForSelector('.ngx-spinner-overlay', { state: 'hidden', timeout: 5000 }).catch(() => {});
        await page.locator('p-dropdownitem.p-element').nth(1).click();

        // Submit button interaction
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'Submit' }).click();
        await pensionPage.okError();
    });

