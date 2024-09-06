import { test, expect } from "./fixtures";

test.beforeEach(async ({ pensionPage }) => {
    await pensionPage.staticLogin();
});

test('can generate first pension bill and save', async ({ pensionPage, page }) => {
    // Arrange
    const ppoId = await pensionPage.savePpoDetails();
    await pensionPage.approvePpo(ppoId);

    // Act
    await page.goto('/#/pension/modules/pension-process/pension-bill', { waitUntil: "domcontentloaded"});
    await page.locator('p-button').getByRole('button', {name: "Open"}).click();
    await page.getByRole('cell', { name: '' + ppoId, exact: true }).click();
    await page.getByRole('textbox', { name: 'Select a date' }).click();
    await page.locator('.p-datepicker-today').click();
    await expect(page.getByRole('textbox', { name: 'Select a date' })).not.toBeEmpty();
    
    await page.getByRole('button', { name: 'Generate' }).click();
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();

    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
    
    // Assert
    await expect(page.getByText('Component Detail:Component')).toBeVisible();
    await expect(page.getByText('Bill Details:Bill')).toBeVisible();
    await expect(page.getByText('Pension Details:PPO')).toBeVisible();
});