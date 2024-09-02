import { test, expect } from '@playwright/test';

test.describe('Approval PPO Component', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    // Navigate to the static login page containing user roles
    await page.goto('/#/static-login');
    await page.waitForTimeout(5000);
    await page.getByRole('link', { name: 'cleark' }).click();
    await expect(page.getByText('CCTSCLERK')).toBeVisible();
    await page.goto('/#/pension/modules/pension-process/approval/ppo-approval');
});

  test('should display static UI elements correctly', async ({ page }) => {
    const elements = [
      { locator: 'text=PPO Approval', type: 'text' },
      { locator: 'input[placeholder="PPO ID"]', type: 'input' },
      { locator: 'app-search-popup', type: 'component' },
      { locator: 'button >> text="Approve"', type: 'button' },
      { locator: 'button >> text="Refresh"', type: 'button' }
    ];

    for (const element of elements) {
      await expect(page.locator(element.locator)).toBeVisible();
    }
  });

  // test('should show error when Approve clicked without PPO ID', async ({ page }) => {
  //   await page.locator('input[placeholder="PPO ID"]').fill('');
  //   await page.locator('button:has-text("Approve")').click();
  //   await expect(page.locator('p-messages div:has-text("required")')).toBeVisible();
  // });

  test('should display search dialog with correct elements', async ({ page }) => {
    await page.click('app-search-popup');
    const dialog = page.locator('div[role="dialog"]');
    await page.waitForTimeout(5000);
    await expect(dialog).toBeVisible();

    await expect(dialog.locator('label[for="float-input"]')).toHaveText('Search data');
    await expect(dialog.locator('input#float-input')).toBeVisible();

    const tableHeaders = ['PPO ID', 'Name of Pensioner', 'Mobile', 'Date of Birth', 'Date of Retirement', 'PPO No'];
    for (const header of tableHeaders) {
      await expect(dialog.locator(`th:has-text("${header}")`)).toBeVisible();
    }
  });

  test('should select PPO and display details', async ({ page }) => {
    await page.click('app-search-popup');
    const dialog = page.locator('div[role="dialog"]');
    await page.waitForTimeout(5000);
    await expect(dialog).toBeVisible();

    await page.waitForSelector('tbody tr');
    const firstRow = dialog.locator('tbody tr:first-child');
    const ppoIdValue = await firstRow.locator('td:first-child').textContent();
    await firstRow.click();
    await expect(dialog).not.toBeVisible();

    await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue(ppoIdValue ?? '');

    const table = page.locator('table');
    await expect(table).toBeVisible();

    const expectedHeaders = ['PPO Id', 'PPO Number', 'Pensioner\'s Name', 'Payment Mode', 'Account Holder', 'Bank Branch Name', 'IFSC Code', 'Bank Account Number', 'Expiry Date', 'Commencement Date'];
    for (const header of expectedHeaders) {
      await expect(table.locator(`th:has-text("${header}")`)).toBeVisible();
    }
  });

  test('should refresh page and clear PPO ID', async ({ page }) => {
    await page.click('app-search-popup');
    await page.waitForTimeout(5000);
    await page.waitForSelector('tbody tr');
    await page.waitForTimeout(5000);
    await page.locator('tbody tr:first-child').click();
    await page.click('button:has-text("Refresh")');
    await expect(page.locator('input[placeholder="PPO ID"]')).toHaveValue('');
  });

  test('should show "No records found" for invalid search', async ({ page }) => {
    await page.waitForTimeout(5000);
    await page.click('app-search-popup');
    await page.waitForTimeout(5000);
    await page.fill('input#float-input', 'NonExistentPPO');
    await expect(page.locator('text="No records found"')).toBeVisible();
  });

  // test('should disable Approve button with invalid form', async ({ page }) => {
  //   await page.locator('input[placeholder="PPO ID"]').fill('');
  //   await expect(page.locator('button:has-text("Approve")')).toBeDisabled();
  // });

  test('should approve PPO successfully', async ({ page }) => {
    await page.click('app-search-popup');
    await page.waitForTimeout(5000);
    await page.waitForSelector('tbody tr');
    await page.locator('tbody tr:first-child').click();
    await page.click('button:has-text("Approve")');
    await expect(page.locator('text=PPO Approved successfully')).toBeVisible();
  });

 test('should route to bank page if bank record is not available', async ({ page }) => {
    await page.click('app-search-popup');
    await page.waitForSelector('tbody tr');
    await page.locator('tbody tr:first-child').click();
    const ppoId = await page.locator('input[placeholder="PPO ID"]').inputValue();
    const table = page.locator('table').last();
    await expect(table).toBeVisible();
    const tableHeaders = ['PPO Id', 'PPO Number', 'Pensioner\'s Name', 'Payment Mode', 'Account Holder', 'Bank Branch Name','IFSC Code','Bank Account Number','Expiry Date','Commencement Date'];
        for (const header of tableHeaders) {
        await expect(table.locator(`th:has-text("${header}")`)).toBeVisible();
        }

    const ppoIdCell = table.locator('td:has-text("PPO Id")');
    if (await ppoIdCell.isVisible()) {
    const ppoNumberCell = table.locator('td:has-text("PPO Number")');
    await expect(ppoNumberCell).toBeVisible();
    } else {
    const message = table.locator('td:has-text("Pensioner bank account not updated")');
    if (await message.isVisible()) {
        await page.click('button:has-text("Update Bank Account Details")');
        await expect(page).toHaveURL(`/#/pension/modules/pension-process/ppo/entry/${ppoId}/bank-account`);
        } 
    }
    });

});